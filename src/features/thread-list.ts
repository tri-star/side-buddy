import * as path from 'path'
import * as fs from 'fs'
import * as vscode from 'vscode'
import { VsCodeLogger } from '@/logging/logger'
import zod from 'zod'
import {
  ConfigStorage,
  type ConfigStorageInterface,
} from '@/api/vs-code/config-storage'
import { type AppConfig } from '@/domain/app-config'
import {
  type GlobalStateManager,
  type GlobalStateKey,
} from '@/api/vs-code/global-state-manager'
import { sendMessage } from '@/api/vs-code/send-message'
import { threadSchema } from '@/domain/thread'
import {
  ThreadRepository,
  type ThreadRepositoryInterface,
} from '@/api/vs-code/thread-repository'
import { panelMessageSchema } from '@/domain/panel-message'

type ViteManifest = {
  'thread-list.html': {
    file: string
    css: string[]
  }
}

export function registerThreadListPanel(
  context: vscode.ExtensionContext,
  globalStateManager: GlobalStateManager
) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'side-buddy.thread-list',
      new ThreadListProvider(context, globalStateManager)
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
    private readonly _globalStateManager: GlobalStateManager,
    configStorage: ConfigStorageInterface = new ConfigStorage(context),
    private readonly _threadRepository: ThreadRepositoryInterface = new ThreadRepository(
      _globalStateManager
    )
  ) {
    this._config = undefined
    this._configStorage = configStorage
    this._extensionUri = context.extensionUri
    this._extensionPath = context.extensionPath
    this._logger = new VsCodeLogger()

    this._globalStateManager.subscribe(this.onGlobalStateUpdate.bind(this))
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

  /**
   * globalStateが更新された時の処理
   * @param key
   * @param value
   */
  private async onGlobalStateUpdate(key: GlobalStateKey, value: unknown) {
    if (this._view == null) {
      throw new Error('_viewがセットされていません')
    }
    let threads = []
    switch (key) {
      case 'side-buddy.thread-list':
        threads = zod.array(threadSchema).parse(value)

        await sendMessage(this._view?.webview, {
          type: 'update-thread-list',
          source: 'side-buddy-extension',
          threads,
        })
        break
    }
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
        manifest['thread-list.html'].file
      )
    )

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'packages',
        'app',
        'dist',
        manifest['thread-list.html'].css[0]
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