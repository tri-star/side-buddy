import { type Thread } from '@/domain/thread'
import { type GlobalStateManager } from './global-state-manager'

export interface ThreadRepositoryInterface {
  save: (thread: Thread) => Promise<void>
  fetchList: () => Promise<Thread[]>
  find: (threadId: string) => Promise<Thread | undefined>
}

export class ThreadRepository implements ThreadRepositoryInterface {
  constructor(private readonly _globalStateManager: GlobalStateManager) {}

  async save(thread: Thread) {
    const threads = this._globalStateManager.getThreadList()

    let found = false
    threads.forEach((t) => {
      if (t.id === thread.id) {
        t.title = thread.title
        t.messages = thread.messages
        found = true
      }
    })

    if (!found) {
      threads.push(thread)
    }
    await this._globalStateManager.updateThreadList(threads)
  }

  async fetchList(): Promise<Thread[]> {
    const threads = this._globalStateManager.getThreadList()

    return await new Promise((resolve) => {
      resolve(threads)
    })
  }

  async find(threadId: string): Promise<Thread | undefined> {
    const threads = await this.fetchList()
    return threads.find((t) => t.id === threadId)
  }
}
