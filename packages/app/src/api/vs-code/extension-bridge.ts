import { type PanelMessage } from '@/domain/panel-message'
import { vsCodeApi } from './vs-code-api'
import {
  type PostMessagePayload,
  type ExtensionMessage,
  type PostMessageDataPart,
  extensionMessageSchema,
} from '@/domain/extension-message'
import { ZodError } from 'zod'
import { getLogger } from '@/logging/logger'

export type MessageHandler = (message: ExtensionMessage) => void

export interface ExtensionBridgeInterface {
  sendPanelMessage: (message: PanelMessage) => void
  listenExtensionMessage: (handler: MessageHandler) => void

  getState: <T>() => T | undefined
  setState: <T>(state: T) => void
}

export class ExtensionBridge implements ExtensionBridgeInterface {
  sendPanelMessage(message: PanelMessage) {
    vsCodeApi.postMessage(message)
  }

  listenExtensionMessage = (handler: MessageHandler) => {
    window.addEventListener('message', (event: PostMessagePayload) => {
      try {
        let data = event.data as PostMessageDataPart
        if (typeof data === 'string') {
          data = JSON.parse(data) as PostMessageDataPart
        }

        if (!String(data.source ?? '').startsWith('side-buddy-extension')) {
          // Other than panel messages are out of scope.
          // Exclude messages that are sent frequently (such as react-dev-tool).
          return
        }

        const message = extensionMessageSchema.parse(data)
        handler(message)
      } catch (e) {
        if (e instanceof ZodError) {
          let dataString = event.data
          if (typeof dataString === 'object') {
            dataString = JSON.stringify(dataString)
          }
          getLogger().warn(
            'Event parse error: \nEvent: ' +
              dataString +
              '\nError:' +
              e.toString()
          )
        } else {
          throw e
        }
      }
    })
  }

  getState<T>(): T | undefined {
    return vsCodeApi.getState()
  }

  setState<T>(state: T): void {
    vsCodeApi.setState(state)
  }
}
