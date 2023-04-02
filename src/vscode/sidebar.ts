import * as vscode from 'vscode';


export function registerSideBarPanel(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('side-buddy.sidebar', new SidebarProvider(context.extensionUri))
  );
}


class SidebarProvider implements vscode.WebviewViewProvider {

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {
  }

  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'sidebar.js'));

    return `<!doctype html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <p>test</p>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
    </html>
    `;
  }
}
