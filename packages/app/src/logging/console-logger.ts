import { type Logger } from './logger'

export class ConsoleLogger implements Logger {
  debug(message: string): void {
    console.debug(message)
  }

  info(message: string): void {
    console.info(message)
  }

  warn(message: string): void {
    console.warn(message)
  }

  error(message: string): void {
    console.error(message)
  }
}
