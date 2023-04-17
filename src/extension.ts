import * as vscode from 'vscode'
import { registerSideBarPanel } from './features/sidebar'
import { registerThreadListPanel } from './features/thread-list'
import { ExtensionEventEmitter } from './api/extension-event-emitter'

export function activate(context: vscode.ExtensionContext) {
  const eventEmitter = new ExtensionEventEmitter()

  const disposable = vscode.commands.registerCommand(
    'side-buddy.reset-api-key',
    () => {
      eventEmitter.emit('reset-api-key', '')
      void vscode.window.showInformationMessage('APIキーをリセットしました。')
    }
  )

  registerSideBarPanel(context, eventEmitter)
  registerThreadListPanel(context, eventEmitter)

  context.subscriptions.push(disposable)
  context.subscriptions.push(eventEmitter)
}

// This method is called when your extension is deactivated
export function deactivate() {}
