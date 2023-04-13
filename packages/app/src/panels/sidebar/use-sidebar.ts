import { type KeyboardEvent, useCallback, useState } from 'react'
import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type AppState } from '@/domain/app-state'
import {
  type ChatMessage,
  chatRequestSchema,
  type ChatRole,
} from '@/domain/chat'
import { requestChatCompletion } from '@/api/open-ai/chat-api'
import * as ulid from 'ulid'
import { vsCodeApi } from '@/api/vs-code/vs-code-api'

export function useSidebar() {
  const [state, setState] = useState<AppState>({
    config: undefined,
    role: 'user',
    temperature: 0.0,
    message: '',
    thread: {
      messages: [],
    },
  })
  const [completion, setCompletion] = useState<string>('')

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

  const addThreadMessage = useCallback((message: ChatMessage) => {
    setState((prev) => {
      vsCodeApi.setState<AppState>({
        ...prev,
        thread: {
          messages: [...prev.thread.messages, message],
        },
      })

      return {
        ...prev,
        thread: {
          messages: [...prev.thread.messages, message],
        },
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

  /**
   * ロールの変更
   */
  const handleRoleChange = useCallback(
    (role: ChatRole) => {
      updateState({
        role,
      })
    },
    [updateState]
  )

  /**
   * temperatureの変更
   */
  const handleTemperatureChange = useCallback(
    (temperature: number) => {
      updateState({
        temperature,
      })
    },
    [updateState]
  )

  /**
   * 送信ボタンの処理
   */
  const submit = useCallback(async () => {
    const messageId = ulid.ulid()
    addThreadMessage({
      id: messageId,
      role: state.role,
      message: state.message,
    })
    updateState({ message: '' })
    setCompletion('')
    let completionResult = ''
    for await (const chunk of requestChatCompletion(
      state.config?.apiKey ?? '',
      state.temperature,
      {
        messages: [
          ...state.thread.messages,
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
    addThreadMessage({
      id: ulid.ulid(),
      role: 'assistant',
      message: completionResult,
    })
    setCompletion('')
  }, [state, updateState, addThreadMessage])

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
    handleRoleChange,
    handleTemperatureChange,
    handleMessageChange,
    completion,
    setCompletion,
    canSubmit,
    submit,
    handleKeyDown,
  }
}
