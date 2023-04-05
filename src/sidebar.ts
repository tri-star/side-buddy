import * as path from 'path'
import * as fs from 'fs'
import * as vscode from 'vscode'

type ViteManifest = {
  'index.html': {
    file: string
    css: string[]
  }
}

export function registerSideBarPanel(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'side-buddy.sidebar',
      new SidebarProvider(context.extensionUri, context.extensionPath)
    )
  )
}

class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _extensionPath: string
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
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
      <meta content="default-src 'none'; img-src ${
        webview.cspSource
      } https:; script-src ${webview.cspSource}; style-src ${
      webview.cspSource
    };"
    </head>
    <body>
      <div id="root"></div>
      <script src="${scriptUri.toString()}"></script>
      <link rel="stylesheet" href="${styleUri.toString()}" />
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
