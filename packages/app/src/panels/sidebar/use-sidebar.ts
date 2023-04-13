import { type KeyboardEvent, useCallback, useState } from 'react'
import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type AppState } from '@/domain/app-state'
import { chatRequestSchema, type ChatRole } from '@/domain/chat'
import { requestChatCompletion } from '@/api/open-ai/chat-api'
import { type Thread } from '@/domain/thread'
import * as ulid from 'ulid'
import { vsCodeApi } from '@/api/vs-code/vs-code-api'

export function useSidebar() {
  const [state, setState] = useState<AppState>({
    config: undefined,
    message: '',
  })
  const [temperature, setTemperature] = useState<number>(0.0)
  const [role, setRole] = useState<ChatRole>('user')
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

  /**
   * 初期化処理
   */
  const init = useCallback(() => {
    listenExtensionMessage(handleExtensionMessage)
    sendPanelMessage({ type: 'loaded' })
    const state = vsCodeApi.getState<AppState>()
    if (state != null) {
      setState(state)
    }
  }, [handleExtensionMessage])

  const updateState = useCallback(
    (newState: Partial<AppState>) => {
      setState({
        ...state,
        ...newState,
      })
    },
    [state]
  )

  /**
   * 送信可能かどうかを返す
   */
  const canSubmit = useCallback((): boolean => {
    const result = chatRequestSchema.safeParse({
      messages: [
        {
          id: ulid.ulid(),
          role,
          message: state.message,
        },
      ],
    })
    return result.success && completion === ''
  }, [role, state, completion])

  /**
   * メッセージ欄入力時の処理
   */
  const handleMessageChange = useCallback((m: string) => {
    setState((prev) => {
      return {
        ...prev,
        message: m,
      }
    })
    vsCodeApi.setState<AppState>({
      message: m,
    })
  }, [])

  /**
   * 送信ボタンの処理
   */
  const submit = useCallback(async () => {
    const messageId = ulid.ulid()
    setThread((prev) => ({
      messages: [
        ...prev.messages,
        {
          id: messageId,
          role,
          message: state.message,
        },
      ],
    }))
    updateState({ message: '' })
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
            message: state.message,
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
  }, [role, temperature, state, thread, updateState])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        void submit()
      }
    },
    [submit]
  )

  return {
    init,
    state,
    temperature,
    setTemperature,
    role,
    setRole,
    handleMessageChange,
    completion,
    setCompletion,
    thread,
    canSubmit,
    submit,
    handleKeyDown,
  }
}
