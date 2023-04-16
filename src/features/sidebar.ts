import * as path from 'path'
import * as fs from 'fs'
import * as vscode from 'vscode'
import { sendMessage } from '@/api/vs-code/send-message'
import { panelMessageSchema } from '@/domain/panel-message'
import { VsCodeLogger } from '@/logging/logger'
import {
  ConfigStorage,
  type ConfigStorageInterface,
} from '@/api/vs-code/config-storage'
import { type AppConfig } from '@/domain/app-config'
import {
  type ThreadRepositoryInterface,
  ThreadRepository,
} from '@/api/vs-code/thread-repository'
import { type Thread } from '@/domain/thread'
import {
  type GlobalStateKey,
  type GlobalStateManager,
} from '@/api/vs-code/global-state-manager'

type ViteManifest = {
  'index.html': {
    file: string
    css: string[]
  }
}

export function registerSideBarPanel(
  context: vscode.ExtensionContext,
  globalStateManager: GlobalStateManager
) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'side-buddy.sidebar',
      new SidebarProvider(context, globalStateManager)
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
    private readonly globalStateManager: GlobalStateManager,
    configStorage: ConfigStorageInterface = new ConfigStorage(context),
    threadRepository: ThreadRepositoryInterface = new ThreadRepository(
      globalStateManager
    )
  ) {
    this._config = undefined
    this._configStorage = configStorage
    this._threadRepository = threadRepository
    this._extensionUri = context.extensionUri
    this._extensionPath = context.extensionPath
    this._logger = new VsCodeLogger()
    this.globalStateManager.subscribe(this.onGlobalStateUpdate.bind(this))
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
    await sendMessage(this._view.webview, {
      type: 'update-thread-list',
      source: 'side-buddy-extension',
      threads,
    })
  }

  /**
   * globalStateが更新された時の処理
   * @param key
   * @param value
   */
  private onGlobalStateUpdate(key: GlobalStateKey, value: unknown) {
    switch (key) {
      case 'side-buddy.load-thread':
        void this.handleLoadThread(value as string)
        break
    }
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
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    // WebView用のHTMLの構築は他画面でも共通化できる部分が多いので、
    // 今後ここを共通化していくことを検討する。
    // - manifestからUriを生成する
    // - URIとscript/styleなどの種別を渡して動的にタグを生成するなど
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
    webviewView.webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this))
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const manifest = this._findAppChunkFileNames(this._extensionPath)
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'packages',
        'app',
        'dist',
        manifest['index.html'].file
      )
    )

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'packages',
        'app',
        'dist',
        manifest['index.html'].css[0]
      )
    )

    return `<!doctype html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta content="default-src 'none';
        img-src ${webview.cspSource} https:;
        script-src ${webview.cspSource};
        style-src ${webview.cspSource};">
    </head>
    <body>
      <div id="root"></div>
      <link rel="stylesheet" href="${styleUri.toString()}" />
      <script type="module" src="${scriptUri.toString()}"></script>
    </body>
    </html>
    `
  }

  private _findAppChunkFileNames(extensionPath: string): ViteManifest {
    const manifestPath = path.resolve(
      extensionPath,
      'packages',
      'app',
      'dist',
      'manifest.json'
    )

    let manifest: ViteManifest | null = null
    try {
      manifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf-8')
      ) as ViteManifest
    } catch (e) {
      // TODO: チャンネルにエラーを報告
      console.error(e)
    }

    if (manifest == null) {
      throw new Error('マニフェストのロードに失敗しました')
    }

    return manifest
  }
}
