import { useCallback, useState } from 'react'
import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type AppState } from '@/domain/app-state'

export function useSidebar() {
  const [state, setState] = useState<AppState>({
    config: undefined,
  })

  /**
   * 拡張機能からのメッセージを受け取り処理する
   * @param message
   */
  const handleExtensionMessage = (message: ExtensionMessage) => {
    switch (message.type) {
      case 'updateConfig':
        setState({
          ...state,
          config: message.config,
        })
    }
  }

  const init = () => {
    listenExtensionMessage(handleExtensionMessage)
    sendPanelMessage({ type: 'loaded' })
  }

  return {
    init: useCallback(init, []),
    state,
  }
}
