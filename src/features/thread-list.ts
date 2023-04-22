import * as vscode from 'vscode'
import { VsCodeLogger } from '@/logging/logger'
import {
  ConfigStorage,
  type ConfigStorageInterface,
} from '@/api/vs-code/config-storage'
import { type AppConfig } from '@/domain/app-config'
import { sendMessage } from '@/api/vs-code/send-message'
import {
  ThreadRepository,
  type ThreadRepositoryInterface,
} from '@/api/vs-code/thread-repository'
import { panelMessageSchema } from '@/domain/panel-message'
import { type ExtensionEventEmitter } from '@/api/extension-event-emitter'
import { getHtmlForWebview } from '@/lib/vs-code/web-view-view-provider'

export function registerThreadListPanel(
  context: vscode.ExtensionContext,
  extensionEventEmitter: ExtensionEventEmitter
) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'side-buddy.thread-list',
      new ThreadListProvider(context, extensionEventEmitter)
    )
  )
}

class ThreadListProvider implements vscode.WebviewViewProvider {
  private readonly _config: AppConfig | undefined
  private readonly _configStorage: ConfigStorageInterface
  private _view?: vscode.WebviewView
  private readonly _extensionUri: vscode.Uri
  private readonly _extensionPath: string
  private readonly _logger: VsCodeLogger

  constructor(
    context: vscode.ExtensionContext,
    private readonly extensionEventEmitter: ExtensionEventEmitter,
    configStorage: ConfigStorageInterface = new ConfigStorage(context),
    private readonly _threadRepository: ThreadRepositoryInterface = new ThreadRepository(
      context
    )
  ) {
    this._config = undefined
    this._configStorage = configStorage
    this._extensionUri = context.extensionUri
    this._extensionPath = context.extensionPath
    this._logger = new VsCodeLogger()

    this.extensionEventEmitter.on(
      'update-thread',
      this.handleUpdateThreadList.bind(this)
    )
  }

  /**
   * パネルから通知されたメッセージを処理する
   * @param message: JSON形式のメッセージ
   */
  private onDidReceiveMessage(message: unknown) {
    const parsedMessage = panelMessageSchema.parse(message)
    switch (parsedMessage.type) {
      case 'loaded':
        void this.handleOnLoad()
        break
      case 'load-thread':
        void this.loadThread(parsedMessage.threadId)
        break
      case 'remove-thread':
        void this.removeThread(parsedMessage.threadId)
        break
    }
  }

  private async handleOnLoad() {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    const threads = await this._threadRepository.fetchList()
    await sendMessage(this._view?.webview, {
      type: 'update-thread-list',
      source: 'side-buddy-extension',
      threads,
    })
  }

  async loadThread(threadId: string) {
    this.extensionEventEmitter.emit('load-thread', threadId)
  }

  async removeThread(threadId: string) {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    await this._threadRepository.remove(threadId)
    await this.handleUpdateThreadList()
  }

  private async handleUpdateThreadList() {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    const threads = await this._threadRepository.fetchList()
    await sendMessage(this._view?.webview, {
      type: 'update-thread-list',
      source: 'side-buddy-extension',
      threads,
    })
  }

  /**
   * WebViewを初期化する
   * @override
   */
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }
    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this._extensionUri,
      this._extensionPath,
      'thread-list.html'
    )
    webviewView.webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this))
  }
}
