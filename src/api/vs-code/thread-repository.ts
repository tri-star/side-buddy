import type * as vscode from 'vscode'
import zod from 'zod'
import { threadSchema, type Thread } from '@/domain/thread'

export interface ThreadRepositoryInterface {
  save: (thread: Thread) => Promise<void>
  fetchList: () => Promise<Thread[]>
  find: (threadId: string) => Promise<Thread | undefined>
}

export class ThreadRepository implements ThreadRepositoryInterface {
  constructor(private readonly _context: vscode.ExtensionContext) {}

  async save(thread: Thread) {
    const threads = await this.fetchList()

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
    await this._context.globalState.update('side-buddy.thread-list', threads)
  }

  async fetchList(): Promise<Thread[]> {
    const result = this._context.globalState.get('side-buddy.thread-list') ?? []
    const threads = zod.array(threadSchema).parse(result)

    if (threads == null) {
      throw new Error('スレッド一覧のパースに失敗しました')
    }

    return await new Promise((resolve) => {
      resolve(threads)
    })
  }

  async find(threadId: string): Promise<Thread | undefined> {
    const threads = await this.fetchList()
    return threads.find((t) => t.id === threadId)
  }
}
