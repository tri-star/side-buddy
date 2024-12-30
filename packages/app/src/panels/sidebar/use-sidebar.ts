import { type KeyboardEvent, useCallback, useContext } from 'react'
import type { ExtensionMessage } from '@/domain/extension-message'
import type { AppState } from '@/domain/app-state'
import {
  type ChatMessage,
  chatRequestSchema,
  type ChatRole,
  type ChatModel,
} from '@/domain/chat'
import { gernerateChatStream } from '@/api/open-ai/chat-api'
import * as ulid from 'ulid'
import { fetchTitleFromMessage } from '@/api/open-ai/utility-api'
import type { ThreadRepositoryFactory } from '@/api/thread/thread-repository'
import { defaultThreadRepositoryFactory } from '@/api/thread/thread-repository'
import { createNewThread } from '@/domain/thread'
import { SidebarStateContext } from './SidebarStateProvider'
import { ExtensionBridgeContext } from '@/providers/ExtensionBridgeStubProvider'

export function useSidebar(
  threadRepositoryFactory: ThreadRepositoryFactory = defaultThreadRepositoryFactory
) {
  const { state, updateState, completion, setCompletion } =
    useContext(SidebarStateContext)
  const { extensionBridge } = useContext(ExtensionBridgeContext)

  const threadRepository = threadRepositoryFactory()

  /**
   * スレッドにメッセージを追加し、useStateとVSCodeのStateを更新する
   */
  const addThreadMessage = useCallback(
    (message: ChatMessage) => {
      updateState((prev: AppState) => ({
        thread: {
          ...prev.thread,
          messages: [...prev.thread.messages, message],
        },
      }))
    },
    [updateState]
  )

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
          break
        case 'load-thread':
          updateState({
            thread: message.thread,
          })
          break
        case 'update-thread-list':
          break
      }
    },
    [updateState]
  )

  /**
   * 初期化処理
   */
  const init = useCallback(() => {
    extensionBridge?.listenExtensionMessage(handleExtensionMessage)
    extensionBridge?.sendPanelMessage({
      type: 'loaded',
      source: 'side-buddy-panel',
    })
    const state = extensionBridge?.getState<AppState>()
    if (state != null) {
      updateState(state)
    }
  }, [extensionBridge, updateState, handleExtensionMessage])

  /**
   * 送信可能かどうかを返す
   */
  const canSubmit = useCallback((): boolean => {
    const result = chatRequestSchema.safeParse({
      model: state.model,
      temperature: state.temperature,
      messages: [
        {
          id: ulid.ulid(),
          role: 'user',
          model: state.model,
          message: state.message,
        },
      ],
    })
    return result.success && completion === ''
  }, [state, completion])

  /**
   * スレッドのタイトルを更新する
   */
  const handleThreadTitleChange = useCallback(
    (title: string) => {
      updateState((prev: AppState) => ({
        thread: {
          ...prev.thread,
          title,
        },
      }))
    },
    [updateState]
  )

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
   * ロールの変更時の処理
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
   * モデルの変更時の処理
   */
  const handleModelChange = useCallback(
    (model: ChatModel) => {
      updateState({
        model,
      })
    },
    [updateState]
  )

  /**
   * temperatureの変更時の処理
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
   * タイトルの自動生成
   */
  const generateTitle = useCallback(() => {
    fetchTitleFromMessage(
      state.config?.apiKey ?? '',
      state.message,
      state.model,
      state.temperature
    )
      .then((title) => {
        handleThreadTitleChange(title)
      })
      .catch((e: unknown) => {
        console.error('タイトルの取得に失敗しました')
      })
  }, [
    state.config?.apiKey,
    state.message,
    state.model,
    state.temperature,
    handleThreadTitleChange,
  ])

  /**
   * 送信ボタンの処理
   */
  const submit = useCallback(async () => {
    const messageId = ulid.ulid()
    addThreadMessage({
      id: messageId,
      role: 'user',
      model: state.model,
      message: state.message,
    })
    updateState({ message: '' })
    setCompletion('')
    let completionResult = ''

    if (state.thread.title === '') {
      generateTitle()
    }

    for await (const chunk of gernerateChatStream(state.config?.apiKey ?? '', {
      temperature: state.temperature,
      model: state.model,
      messages: [
        ...state.thread.messages,
        {
          id: messageId,
          role: 'user',
          model: state.model,
          message: state.message,
        },
      ],
    })) {
      setCompletion((prev) => prev + chunk)
      completionResult += chunk
    }
    addThreadMessage({
      id: ulid.ulid(),
      role: 'assistant',
      model: state.model,
      message: completionResult,
    })
    setCompletion('')
  }, [state, setCompletion, updateState, addThreadMessage, generateTitle])

  /**
   * テキストエリア内のキー押下時の処理。(Ctrl+Enterでの送信の処理)
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === 'Enter' &&
        (event.ctrlKey || event.shiftKey || event.metaKey)
      ) {
        void submit()
      }
    },
    [submit]
  )

  const handleRemoveMessage = (messageId: string) => {
    const newMessages = state.thread.messages.filter((m) => m.id !== messageId)
    updateState({
      thread: {
        ...state.thread,
        messages: newMessages,
      },
    })
  }

  /**
   * スレッドのクリア
   */
  const handleClearThread = useCallback(() => {
    // if (!confirm('スレッドをクリアしますか？')) {
    //   return
    // }
    updateState({
      thread: createNewThread(),
    })
  }, [updateState])

  /**
   * スレッドの保存
   */
  const handleSaveThread = useCallback(async (): Promise<void> => {
    await threadRepository.save(state.thread)
  }, [state, threadRepository])

  return {
    init,
    state,
    handleThreadTitleChange,
    handleRoleChange,
    handleModelChange,
    handleTemperatureChange,
    handleMessageChange,
    completion,
    setCompletion,
    canSubmit,
    submit,
    handleKeyDown,
    handleRemoveMessage,
    handleClearThread,
    handleSaveThread,
  }
}
