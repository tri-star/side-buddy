import { type PanelMessage } from '@/domain/panel-message'
import { type ExtensionStubInterface } from './extension-stub'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type AppConfig } from '@/domain/app-config'

export class SidebarExtensionStub implements ExtensionStubInterface {
  private config: AppConfig | undefined

  async start() {
    this.config = {
      apiKey: window.localStorage.getItem('apiKey') ?? '',
      defaultTemperature: parseFloat(
        import.meta.env.VITE_APP_CONFIG_DEFAULT_TEMPERATURE ?? '0.0'
      ),
    }
  }

  /**
   * Emurates the behavior of the extension.
   * (Receive a message from panel, and send a message to the panel)
   * @param message
   */
  onReceivePanelMessage(message: PanelMessage) {
    if (this.config == null) {
      throw new Error('config is not initialized')
    }
    switch (message.type) {
      case 'loaded':
        window.postMessage({
          type: 'updateConfig',
          source: 'side-buddy-extension',
          config: this.config,
        })
        break
      case 'set-api-key':
        this.config.apiKey = message.apiKey
        window.postMessage({
          type: 'updateConfig',
          source: 'side-buddy-extension',
          config: this.config,
        } satisfies ExtensionMessage)
        break
    }
  }
}
