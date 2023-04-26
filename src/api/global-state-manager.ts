import zod from 'zod'
import { threadSchema, type Thread } from '@/domain/thread'
import type * as vscode from 'vscode'

export type GlobalStateKey = 'side-buddy.thread-list' | 'side-buddy.load-thread'

export type GlobalStateUpdateCallback = (
  key: GlobalStateKey,
  value: unknown
) => void

type SubscribeEntries = GlobalStateUpdateCallback[]

/**
 * VSCodeのGlobalStateの変更を監視する
 */
export class GlobalStateManager {
  private _subscribers: SubscribeEntries = []

  constructor(private readonly _context: vscode.ExtensionContext) {}

  subscribe(callback: GlobalStateUpdateCallback) {
    this._subscribers.push(callback)
  }

  async updateThreadList(threads: Thread[]) {
    await this._update('side-buddy.thread-list', threads)
  }

  getThreadList(): Thread[] {
    const result = this._context.globalState.get('side-buddy.thread-list') ?? []
    return zod.array(threadSchema).parse(result)
  }

  async loadThread(threadId: string) {
    await this._update('side-buddy.load-thread', threadId)
  }

  private async _update(key: GlobalStateKey, value: unknown) {
    await this._context.globalState.update(key, value)

    this._subscribers.forEach((callback) => {
      callback(key, value)
    })
  }

  get(key: GlobalStateKey, defaultValue: unknown | undefined): unknown {
    return this._context.globalState.get(key)
  }

  dispose() {
    this._subscribers = []
  }
}
