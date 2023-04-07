import { type ExtensionMessage } from 'domain/extension-message'

export const handleExtensionMessage = (message: ExtensionMessage) => {
  switch (message.type) {
    case 'updateConfig':
      console.log('updateConfig', message)
  }
}
