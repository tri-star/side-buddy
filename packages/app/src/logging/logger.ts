import { isVsCodeEnv } from '@/api/extension/vs-code-api'
import { ConsoleLogger } from './console-logger'
import { VsCodeLogger } from './vs-code-logger'

export interface Logger {
  debug: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

let logger: Logger | undefined = undefined

export const getLogger = (): Logger => {
  if (logger === undefined) {
    if (isVsCodeEnv()) {
      logger = new VsCodeLogger()
    } else {
      logger = new ConsoleLogger()
    }
  }
  return logger
}
