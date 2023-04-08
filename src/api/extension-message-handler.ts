import type vscode from 'vscode'
import { type ExtensionMessage } from '../domain/extension-message'

export class ExtensionMessageHandler {
  constructor(private readonly webView: vscode.Webview) {}

  async sendMessage(message: ExtensionMessage) {
    console.log('Data: ' + JSON.stringify(message))

    await this.webView.postMessage(JSON.stringify(message))
  }
}
