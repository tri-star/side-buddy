import { type ExtensionMessage } from 'domain/extension-message'

export const handleExtensionMessage = (message: ExtensionMessage) => {
  console.log('message received.', message)
  switch (message.type) {
    case 'updateConfig':
      console.log('updateConfig', message)
  }
}
