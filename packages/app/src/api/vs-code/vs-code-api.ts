// ------------------------------------------------------------

import { type PanelMessage, panelMessageSchema } from '@/domain/panel-message'

// VSCodeのWebViewが提供するacquireVsCodeApi() に関する定義
export type VsCodeApi = {
  postMessage: <T>(message: T) => void

  getState: <T>() => T | undefined
  setState: <T>(state: T) => void
}

declare const acquireVsCodeApi: () => VsCodeApi

export const isVsCodeEnv = (): boolean => {
  return typeof acquireVsCodeApi !== 'undefined'
}

export const vsCodeApi = isVsCodeEnv()
  ? acquireVsCodeApi()
  : acquireVsCodeApiStub()

/**
 * VSCodeのWebViewが提供するacquireVsCodeApi()をエミュレートする
 * VSCode外で開発する時に使用する
 */
function acquireVsCodeApiStub(): VsCodeApi {
  return {
    postMessage<T>(message: T) {
      const parsedMessage = panelMessageSchema.parse(message)
      switch (parsedMessage.type) {
        case 'set-api-key':
          window.localStorage.setItem('apiKey', parsedMessage.apiKey)
          // VSCode拡張への通知をエミュレートするため、postMessageでメッセージ送信する。
          // 今は、extension-stub.ts内のmessageリスナがこれを処理する
          window.postMessage({
            type: 'set-api-key',
            source: 'side-buddy-panel',
            apiKey: parsedMessage.apiKey,
          } satisfies PanelMessage)
          break
      }
    },
    getState: () => undefined,
    setState: () => {},
  }
}
