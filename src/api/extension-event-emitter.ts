import type { ExtensionEventType } from '@/domain/extension-event'
import { EventEmitter } from 'events'

/**
 * 拡張機能内でパネル等をまたがって通信するためのEventEmitter。
 * dispose時に全てのイベントリスナーを削除する。
 */
export class ExtensionEventEmitter {
  private readonly emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  on<T>(
    eventType: ExtensionEventType,
    listener: (event: T) => void | Promise<void>
  ): this {
    this.emitter.on(eventType, listener)
    return this
  }

  emit(eventType: ExtensionEventType, event: unknown): boolean {
    return this.emitter.emit(eventType, event)
  }

  dispose() {
    this.emitter.removeAllListeners()
  }
}
