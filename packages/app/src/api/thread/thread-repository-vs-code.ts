import { type Thread } from '@/domain/thread'
import { type ThreadRepositoryInterface } from './thread-repository'
import { vsCodeApi } from '@/api/extension/vs-code-api'

export class ThreadRepositoryVsCode implements ThreadRepositoryInterface {
  async save(thread: Thread) {
    vsCodeApi.postMessage({
      type: 'save-thread',
      source: 'side-buddy-panel',
      thread,
    })
    await new Promise<void>((resolve) => {
      resolve()
    })
  }
}
