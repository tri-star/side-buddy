// ------------------------------------------------------------

import {
  type ExtensionMessage,
  extensionMessageSchema,
} from 'domain/extension-message'

// VSCodeのWebViewが提供するacquireVsCodeApi() に関する定義
export type VsCodeApi = {
  postMessage: <T>(message: T) => void

  getState: <T>() => T | undefined
}

declare const acquireVsCodeApi: () => VsCodeApi

export const isVsCodeEnv = (): boolean => {
  return typeof acquireVsCodeApi !== 'undefined'
}

export const vsCodeApi = isVsCodeEnv()
  ? acquireVsCodeApi()
  : acquireVsCodeApiStub()

function acquireVsCodeApiStub(): VsCodeApi {
  return {
    postMessage: () => {},
    getState: () => undefined,
  }
}

// ------------------------------------------------------------
// WebView間で通信するためのメッセージハンドラの定義

type MessageHandler = (message: ExtensionMessage) => void

export const listenExtensionMessage = (handler: MessageHandler) => {
  window.addEventListener('message', (event: unknown) => {
    const message = extensionMessageSchema.parse(event)
    handler(message)
  })
}
