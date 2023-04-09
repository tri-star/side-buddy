import {
  extensionMessageSchema,
  type ExtensionMessage,
  type PostMessagePayload,
} from '@/domain/extension-message'
import { getLogger } from '@/logging/logger'
import { ZodError } from 'zod'

type MessageHandler = (message: ExtensionMessage) => void

export const listenExtensionMessage = (handler: MessageHandler) => {
  window.addEventListener('message', (event: PostMessagePayload) => {
    try {
      let data = event.data
      if (typeof data === 'string') {
        data = JSON.parse(data) as object
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
