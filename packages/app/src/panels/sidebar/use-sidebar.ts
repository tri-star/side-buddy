import { useCallback, useState } from 'react'
import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type AppState } from '@/domain/app-state'
import { chatRequestSchema, type ChatRole } from '@/domain/chat'
import { requestChatCompletion } from '@/api/open-ai/chat-api'
import { type Thread } from '@/domain/thread'
import * as ulid from 'ulid'

export function useSidebar() {
  const [state, setState] = useState<AppState>({
    config: undefined,
  })
  const [temperature, setTemperature] = useState<number>(0.0)
  const [role, setRole] = useState<ChatRole>('user')
  const [message, setMessage] = useState<string>('')
  const [completion, setCompletion] = useState<string>('')
  const [thread, setThread] = useState<Thread>({
    messages: [],
  })

  /**
   * 拡張機能からのメッセージを受け取り処理する
   * @param message
   */
  const handleExtensionMessage = useCallback(
    (message: ExtensionMessage) => {
      switch (message.type) {
        case 'updateConfig':
          setState({
            ...state,
            config: message.config,
          })
          setTemperature(message.config?.defaultTemperature ?? 0.0)
      }
    },
    [state]
  )

  const init = useCallback(() => {
    listenExtensionMessage(handleExtensionMessage)
    sendPanelMessage({ type: 'loaded' })
  }, [handleExtensionMessage])

  const canSubmit = useCallback((): boolean => {
    const result = chatRequestSchema.safeParse({
      messages: [
        {
          id: ulid.ulid(),
          role,
          message,
        },
      ],
    })
    return result.success
  }, [role, message])

  const submit = useCallback(async () => {
    const messageId = ulid.ulid()
    setThread((prev) => ({
      messages: [
        ...prev.messages,
        {
          id: messageId,
          role,
          message,
        },
      ],
    }))
    setCompletion('')
    let completionResult = ''
    for await (const chunk of requestChatCompletion(
      state.config?.apiKey ?? '',
      temperature,
      {
        messages: [
          ...thread.messages,
          {
            id: messageId,
            role,
            message,
          },
        ],
      }
    )) {
      setCompletion((prev) => prev + chunk)
      completionResult += chunk
    }
    setThread((prev) => ({
      messages: [
        ...prev.messages,
        {
          id: ulid.ulid(),
          role: 'assistant',
          message: completionResult,
        },
      ],
    }))
    setCompletion('')
  }, [role, temperature, message, state, thread])

  return {
    init,
    state,
    temperature,
    setTemperature,
    role,
    setRole,
    message,
    setMessage,
    completion,
    setCompletion,
    thread,
    canSubmit,
    submit,
  }
}
