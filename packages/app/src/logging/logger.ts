import { isVsCodeEnv } from 'api/vs-code-api'
import { ConsoleLogger } from './console-logger'

export interface Logger {
  debug: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
}

export const getLogger = (): Logger => {
  if (isVsCodeEnv()) {
    return new ConsoleLogger()
  }
  return new ConsoleLogger()
}
