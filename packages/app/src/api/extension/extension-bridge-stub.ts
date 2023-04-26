import {
  type PostMessagePayload,
  type PostMessageDataPart,
  extensionMessageSchema,
} from '@/domain/extension-message'
import { type PanelMessage } from '@/domain/panel-message'
import {
  type ExtensionBridgeInterface,
  type MessageHandler,
} from './extension-bridge'
import { ZodError } from 'zod'
import { getLogger } from '@/logging/logger'
import { type ExtensionStubInterface } from './extension-stub/extension-stub'

export class ExtensionBridgeStub implements ExtensionBridgeInterface {
  constructor(private readonly extensionStub: ExtensionStubInterface) {}

  sendPanelMessage(message: PanelMessage) {
    this.extensionStub.onReceivePanelMessage(message)
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
    return undefined
  }

  setState<T>(state: T): void {}
}
