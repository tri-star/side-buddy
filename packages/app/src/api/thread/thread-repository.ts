import { type Thread } from '@/domain/thread'
import { ThreadRepositoryLocalStorage } from '@/api/thread/thread-repository-local-storage'

export type ThreadRepositoryFactory = () => ThreadRepositoryInterface

export interface ThreadRepositoryInterface {
  save: (thread: Thread) => Promise<void>

  fetchList: () => Promise<Thread[]>
}

/**
 * 環境に応じたThreadRepositoryを生成して返す
 */
export function defaultThreadRepositoryFactory(): ThreadRepositoryInterface {
  // 現時点では常にローカルストレージを使用。
  // 将来的にS3などもサポートする
  return new ThreadRepositoryLocalStorage()
}
