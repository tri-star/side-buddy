import type vscode from 'vscode'
import { type ExtensionMessage } from '@/domain/extension-message'

export async function sendMessage(
  webView: vscode.Webview,
  message: ExtensionMessage
) {
  await webView.postMessage(JSON.stringify(message))
}
