import { useCallback } from 'react'
import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { getLogger } from '@/logging/logger'

export function useSidebar() {
  return {
    init: useCallback(init, []),
  }
}

/**
 * 初期化時の処理を実行する
 */
function init() {
  listenExtensionMessage(handleExtensionMessage)
  sendPanelMessage({ type: 'loaded' })
}

/**
 * 拡張機能からのメッセージを受け取り処理する
 * @param message
 */
function handleExtensionMessage(message: ExtensionMessage) {
  const logger = getLogger()
  switch (message.type) {
    case 'updateConfig':
      logger.debug(JSON.stringify(message))
  }
}
