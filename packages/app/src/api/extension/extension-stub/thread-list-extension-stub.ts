import type { PanelMessage } from '@/domain/panel-message'
import type { ExtensionStubInterface } from './extension-stub'
import type { ExtensionMessage } from '@/domain/extension-message'
import type { AppConfig } from '@/domain/app-config'
import { type Thread, threadSchema } from '@/domain/thread'

export class ThreadListExtensionStub implements ExtensionStubInterface {
  private readonly config: AppConfig | undefined

  async start() {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 設定情報を通知する
    const message: ExtensionMessage = {
      type: 'update-thread-list',
      source: 'side-buddy-extension',
      threads: this.loadThreads(),
    }

    window.postMessage(message)
  }

  /**
   * Emurates the behavior of the extension.
   * (Receive a message from panel, and send a message to the panel)
   * @param message
   */
  onReceivePanelMessage(message: PanelMessage) {
    switch (message.type) {
      case 'remove-thread':
        window.postMessage({
          type: 'update-thread-list',
          source: 'side-buddy-extension',
          threads: this.loadThreads(),
        } satisfies ExtensionMessage)
        break
      case 'load-thread':
      case 'loaded':
      case 'log':
      case 'save-thread':
      case 'set-api-key':
        break
    }
  }

  private loadThreads(): Thread[] {
    const threads = localStorage.getItem('threads')
    let threadList: Thread[] = []
    if (threads != null) {
      threadList = (JSON.parse(threads) as unknown[]).map((t: unknown) =>
        threadSchema.parse(t)
      )
    }
    return threadList
  }
}
