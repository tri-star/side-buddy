import {
  extensionMessageSchema,
  type ExtensionMessage,
} from '@/domain/extension-message'
import { ZodError } from 'zod'

type MessageHandler = (message: ExtensionMessage) => void

export const listenExtensionMessage = (handler: MessageHandler) => {
  window.addEventListener('message', (event) => {
    try {
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
}
