import { isVsCodeEnv } from '@/api/vs-code/vs-code-api'
import { ConsoleLogger } from './console-logger'
import { VsCodeLogger } from './vs-code-logger'

export interface Logger {
  debug: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

let logger: Logger | undefined

export const getLogger = (): Logger => {
  if (logger === undefined) {
    if (isVsCodeEnv()) {
      logger = new VsCodeLogger()
    }
    logger = new ConsoleLogger()
  }
  return logger
}
