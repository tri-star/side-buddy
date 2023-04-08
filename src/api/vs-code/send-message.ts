import type vscode from 'vscode'
import { type ExtensionMessage } from '@/domain/extension-message'

export async function sendMessage(
  webView: vscode.Webview,
  message: ExtensionMessage
) {
  console.log('Data: ' + JSON.stringify(message))
  await webView.postMessage(JSON.stringify(message))
}
