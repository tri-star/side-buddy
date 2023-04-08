// ------------------------------------------------------------

import {
  type ExtensionMessage,
  extensionMessageSchema,
} from 'domain/extension-message'
import { ZodError } from 'zod'

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
  window.addEventListener('message', (event) => {
    try {
      console.log('receive extension message: ', event.data)
      const message = extensionMessageSchema.parse(
        JSON.parse(String(event.data))
      )
      handler(message)
    } catch (e) {
      if (e instanceof ZodError) {
        console.warn(e)
      } else {
        throw e
      }
    }
  })
  console.log('listen start.')
}
