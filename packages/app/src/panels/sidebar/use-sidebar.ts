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
    role: 'user',
    message: '',
  })
  const [temperature, setTemperature] = useState<number>(0.0)
  const [completion, setCompletion] = useState<string>('')
  const [thread, setThread] = useState<Thread>({
    messages: [],
  })

  const updateState = useCallback((newState: Partial<AppState>) => {
    setState((prev) => {
      vsCodeApi.setState<AppState>({
        ...prev,
        ...newState,
      })

      return {
        ...prev,
        ...newState,
      }
    })
  }, [])

  /**
   * 拡張機能からのメッセージを受け取り処理する
   * @param message
   */
  const handleExtensionMessage = useCallback(
    (message: ExtensionMessage) => {
      switch (message.type) {
        case 'updateConfig':
          updateState({
            config: message.config,
          })
          setTemperature(message.config?.defaultTemperature ?? 0.0)
      }
    },
    [updateState]
  )

  /**
   * 初期化処理
   */
  const init = useCallback(() => {
    listenExtensionMessage(handleExtensionMessage)
    sendPanelMessage({ type: 'loaded' })
    const state = vsCodeApi.getState<AppState>()
    if (state != null) {
      updateState(state)
    }
  }, [updateState, handleExtensionMessage])

  /**
   * 送信可能かどうかを返す
   */
  const canSubmit = useCallback((): boolean => {
    const result = chatRequestSchema.safeParse({
      messages: [
        {
          id: ulid.ulid(),
          role: state.role,
          message: state.message,
        },
      ],
    })
    return result.success && completion === ''
  }, [state, completion])

  /**
   * メッセージ欄入力時の処理
   */
  const handleMessageChange = useCallback(
    (message: string) => {
      updateState({
        message,
      })
    },
    [updateState]
  )

  const handleRoleChange = useCallback(
    (role: ChatRole) => {
      updateState({
        role,
      })
    },
    [updateState]
  )

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
          role: state.role,
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
            role: state.role,
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
  }, [temperature, state, thread, updateState])

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
    handleRoleChange,
    handleMessageChange,
    completion,
    setCompletion,
    thread,
    canSubmit,
    submit,
    handleKeyDown,
  }
}
