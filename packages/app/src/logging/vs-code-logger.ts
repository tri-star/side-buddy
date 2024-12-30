import { vsCodeApi } from '@/api/extension/vs-code-api'
import type { Logger } from './logger'
import type { PanelMessage } from '@/domain/panel-message'

export class VsCodeLogger implements Logger {
  debug(message: string): void {
    vsCodeApi.postMessage<PanelMessage>({
      type: 'log',
      source: 'side-buddy-panel',
      level: 'debug',
      message,
    })
  }

  info(message: string): void {
    vsCodeApi.postMessage<PanelMessage>({
      type: 'log',
      source: 'side-buddy-panel',
      level: 'info',
      message,
    })
  }

  warn(message: string): void {
    vsCodeApi.postMessage<PanelMessage>({
      type: 'log',
      source: 'side-buddy-panel',
      level: 'warn',
      message,
    })
  }

  error(message: string): void {
    vsCodeApi.postMessage<PanelMessage>({
      type: 'log',
      source: 'side-buddy-panel',
      level: 'error',
      message,
    })
  }
}
