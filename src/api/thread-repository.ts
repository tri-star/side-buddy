import type * as vscode from 'vscode'
import { type Thread, savedThreadListSchema } from '@/domain/thread'
import { threadListMigrations } from '@/migrations/thread-list'
import { type VersionedDocument, migrate } from '@tri-star/json-migrate'

export interface ThreadRepositoryInterface {
  save: (thread: Thread) => Promise<void>
  fetchList: () => Promise<Thread[]>
  find: (threadId: string) => Promise<Thread | undefined>
  remove: (threadId: string) => Promise<void>
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

    await this._context.globalState.update('side-buddy.thread-list', {
      version: 2, // FIXME: get version from json-migrate migration definition.
      threadList: threads,
    })
  }

  async fetchList(): Promise<Thread[]> {
    const result = this._context.globalState.get('side-buddy.thread-list') ?? []

    const migratedThreadList = await migrate(
      result as unknown as VersionedDocument,
      threadListMigrations
    )

    const savedThreadList = savedThreadListSchema.parse(migratedThreadList)

    if (savedThreadList == null) {
      throw new Error('スレッド一覧のパースに失敗しました')
    }

    return await new Promise((resolve) => {
      resolve(savedThreadList.threadList)
    })
  }

  async find(threadId: string): Promise<Thread | undefined> {
    const threads = await this.fetchList()
    return threads.find((t) => t.id === threadId)
  }

  async remove(threadId: string) {
    const threads = await this.fetchList()
    const newThreads = threads.filter((t) => t.id !== threadId)
    await this._context.globalState.update('side-buddy.thread-list', newThreads)
  }
}
