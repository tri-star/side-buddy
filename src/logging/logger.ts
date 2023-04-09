import * as vscode from 'vscode'

export interface Logger {
  debug: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

export class VsCodeLogger implements Logger {
  private _channel?: vscode.OutputChannel

  log(level: string, message: string) {
    if (this._channel == null) {
      this._channel = vscode.window.createOutputChannel('Side Buddy')
    }
    this._channel.appendLine(`[${level}] ${message}`)
  }

  debug(message: string) {
    this.log('debug', message)
  }

  info(message: string) {
    this.log('info', message)
  }

  warn(message: string) {
    this.log('warn', message)
  }

  error(message: string) {
    this.log('error', message)
  }
}
