import * as vscode from 'vscode'
import { sendMessage } from '@/api/send-message'
import { panelMessageSchema } from '@/domain/panel-message'
import { VsCodeLogger } from '@/logging/logger'
import {
  ConfigStorage,
  type ConfigStorageInterface,
} from '@/api/config-storage'
import type { AppConfig } from '@/domain/app-config'
import {
  type ThreadRepositoryInterface,
  ThreadRepository,
} from '@/api/thread-repository'
import type { Thread } from '@/domain/thread'
import type { ExtensionEventEmitter } from '@/api/extension-event-emitter'
import { getHtmlForWebview } from '@/lib/vs-code/web-view-view-provider'

export function registerSideBarPanel(
  context: vscode.ExtensionContext,
  extensionEventEmitter: ExtensionEventEmitter
) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'side-buddy.sidebar',
      new SidebarProvider(context, extensionEventEmitter)
    )
  )
}

class SidebarProvider implements vscode.WebviewViewProvider {
  private _config: AppConfig | undefined
  private readonly _configStorage: ConfigStorageInterface
  private readonly _threadRepository: ThreadRepositoryInterface
  private _view?: vscode.WebviewView
  private readonly _extensionUri: vscode.Uri
  private readonly _extensionPath: string
  private readonly _logger: VsCodeLogger

  constructor(
    context: vscode.ExtensionContext,
    private readonly extensionEventEmitter: ExtensionEventEmitter,
    configStorage: ConfigStorageInterface = new ConfigStorage(context),
    threadRepository: ThreadRepositoryInterface = new ThreadRepository(context)
  ) {
    this._config = undefined
    this._configStorage = configStorage
    this._threadRepository = threadRepository
    this._extensionUri = context.extensionUri
    this._extensionPath = context.extensionPath
    this._logger = new VsCodeLogger()

    this.extensionEventEmitter.on<string>(
      'load-thread',
      this.handleLoadThread.bind(this)
    )
    this.extensionEventEmitter.on<string>('reset-api-key', async () => {
      await this.handleSetApiKeyStored('')
    })
  }

  /**
   * パネルから通知されたメッセージを処理する
   * @param message: JSON形式のメッセージ
   */
  private onDidReceiveMessage(message: unknown) {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    const parsedMessage = panelMessageSchema.parse(message)
    switch (parsedMessage.type) {
      case 'loaded':
        void this.handleWebViewLoaded()
        break
      case 'set-api-key':
        void this.handleSetApiKeyStored(parsedMessage.apiKey)
        break
      case 'save-thread':
        void this.handleThreadSaved(parsedMessage.thread)
        break
      case 'log':
        this._logger.log(parsedMessage.level, parsedMessage.message)
        break
      case 'load-thread':
      case 'remove-thread':
        break
    }
  }

  /**
   * WebView(React側)のロードが完了した時の処理
   */
  private async handleWebViewLoaded() {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    this._config = await this._configStorage.load()
    await this.notifyConfigUpdated()
    const threads = await this._threadRepository.fetchList()
    await sendMessage(this._view.webview, {
      type: 'update-thread-list',
      source: 'side-buddy-extension',
      threads,
    })
  }

  /**
   * WebViewからAPIキーを設定した通知を受け取った時
   * @param apiKey
   */
  private async handleSetApiKeyStored(apiKey: string) {
    if (this._config == null) {
      throw new Error('_configがセットされていません')
    }
    this._config.apiKey = apiKey
    await this._configStorage.save(this._config)
    await this.notifyConfigUpdated()
  }

  /**
   * 設定が更新されたことをWebView側に知らせる
   */
  private async notifyConfigUpdated() {
    if (this._config == null) {
      throw new Error('_configがセットされていません')
    }
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    await sendMessage(this._view.webview, {
      type: 'updateConfig',
      source: 'side-buddy-extension',
      config: this._config,
    })
  }

  /**
   * スレッドが保存された
   * @param apiKey
   */
  private async handleThreadSaved(thread: Thread) {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    await this._threadRepository.save(thread)
    const threads = await this._threadRepository.fetchList()
    this.extensionEventEmitter.emit('update-thread', threads)
  }

  private async handleLoadThread(threadId: string) {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    const thread = await this._threadRepository.find(threadId)
    if (thread == null) {
      throw new Error(`スレッドが見つかりませんでした: ${threadId}`)
    }

    await sendMessage(this._view?.webview, {
      type: 'load-thread',
      source: 'side-buddy-extension',
      thread,
    })
  }

  /**
   * WebViewを初期化する
   * @override
   */
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
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
      'index.html'
    )
    webviewView.webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this))
  }
}
