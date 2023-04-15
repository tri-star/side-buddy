// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { registerSideBarPanel } from './features/sidebar'
import { registerThreadListPanel } from './features/thread-list'
import { GlobalStateManager } from './api/vs-code/global-state-manager'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'side-buddy.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      void vscode.window.showInformationMessage('Hello World from side-buddy!')
    }
  )

  const globalStateManager = new GlobalStateManager(context)

  registerSideBarPanel(context, globalStateManager)
  registerThreadListPanel(context, globalStateManager)

  context.subscriptions.push(disposable)
  context.subscriptions.push(globalStateManager)
}

// This method is called when your extension is deactivated
export function deactivate() {}
