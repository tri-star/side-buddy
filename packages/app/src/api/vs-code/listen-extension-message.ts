import {
  extensionMessageSchema,
  type ExtensionMessage,
  type PostMessagePayload,
  type PostMessageDataPart,
} from '@/domain/extension-message'
import { getLogger } from '@/logging/logger'
import { ZodError } from 'zod'

type MessageHandler = (message: ExtensionMessage) => void

export const listenExtensionMessage = (handler: MessageHandler) => {
  window.addEventListener('message', (event: PostMessagePayload) => {
    try {
      let data = event.data as PostMessageDataPart
      if (typeof data === 'string') {
        data = JSON.parse(data) as PostMessageDataPart
      }

      if (String(data.source ?? '').startsWith('react-devtools')) {
        // React dev toolsからの通知は対象外
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
