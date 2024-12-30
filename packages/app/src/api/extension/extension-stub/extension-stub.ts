import type { PanelMessage } from '@/domain/panel-message'

/**
 * Interface for emulate VsCode behaviour, for develop without VSCode.
 */
export interface ExtensionStubInterface {
  start: () => Promise<void>

  /**
   * Emurates the behavior of the extension.
   * (Receive a message from panel, and send a message to the panel)
   * @param message
   */
  onReceivePanelMessage: (message: PanelMessage) => void
}
