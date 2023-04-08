import { vsCodeApi } from '@/api/vs-code/vs-code-api'
import { type Logger } from './logger'

export class VsCodeLogger implements Logger {
  debug(message: string): void {
    vsCodeApi.postMessage({
      type: 'log',
      level: 'debug',
      message,
    })
  }

  info(message: string): void {
    vsCodeApi.postMessage({
      type: 'log',
      level: 'info',
      message,
    })
  }

  warn(message: string): void {
    vsCodeApi.postMessage({
      type: 'log',
      level: 'warn',
      message,
    })
  }

  error(message: string): void {
    vsCodeApi.postMessage({
      type: 'log',
      level: 'error',
      message,
    })
  }
}
