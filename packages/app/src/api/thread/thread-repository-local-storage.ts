import { threadSchema, type Thread } from '@/domain/thread'
import { type ThreadRepositoryInterface } from './thread-repository'

export class ThreadRepositoryLocalStorage implements ThreadRepositoryInterface {
  async save(thread: Thread) {
    const threads = await this.fetchList()

    let found = false
    threads.forEach((t) => {
      if (t.id === thread.id) {
        found = true
        t.title = thread.title
        t.messages = thread.messages
      }
    })

    if (!found) {
      threads.push(thread)
    }
    localStorage.setItem('threads', JSON.stringify(threads))
  }

  async fetchList(): Promise<Thread[]> {
    const threads = localStorage.getItem('threads')
    if (threads != null) {
      const threadList = (JSON.parse(threads) as unknown[]).map(
        (t: unknown) => {
          return threadSchema.parse(t)
        }
      )
      return await new Promise((resolve) => {
        resolve(threadList)
      })
    }
    return []
  }
}
