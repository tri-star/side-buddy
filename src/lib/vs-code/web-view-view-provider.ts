import * as path from 'path'
import * as fs from 'fs'
import { type Uri } from 'vscode'
import * as vscode from 'vscode'

type ViteManifest = Record<
  string,
  {
    file: string
    css: string[]
  }
>

/**
 * Generate HTML for webView and return it
 * @param webview - context.webView.webViewView object
 * @param extensionUri - URL of the extension, used to specify content security policy
 * @param extensionPath - Path of the extension, used to identify manifest.json
 * @param entryFileName - Name of the entry file(e.g. index.html), used to identify chunk js/cssfile name from manifest.json
 */
export function getHtmlForWebview(
  webview: vscode.Webview,
  extensionUri: Uri,
  extensionPath: string,
  entryFileName: string
): string {
  const manifest = findAppChunkFileNames(extensionPath)
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      'packages',
      'app',
      'dist',
      manifest[entryFileName].file
    )
  )

  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      'packages',
      'app',
      'dist',
      manifest[entryFileName].css[0]
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

/**
 * get chunk file names from Vite manifest file
 * @param extensionPath
 */
function findAppChunkFileNames(extensionPath: string): ViteManifest {
  const manifestPath = path.resolve(
    extensionPath,
    'packages',
    'app',
    'dist',
    'manifest.json'
  )

  let manifest: ViteManifest | null = null
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ViteManifest

  if (manifest == null) {
    throw new Error('failed to load manifest')
  }

  return manifest
}
