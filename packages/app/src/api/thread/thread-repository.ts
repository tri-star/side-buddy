import { type Thread } from '@/domain/thread'
import { ThreadRepositoryLocalStorage } from '@/api/thread/thread-repository-local-storage'
import { isVsCodeEnv } from '../vs-code/vs-code-api'
import { ThreadRepositoryVsCode } from './thread-repository-vs-code'

export type ThreadRepositoryFactory = () => ThreadRepositoryInterface

export interface ThreadRepositoryInterface {
  /**
   * スレッドを拡張機能のグローバルステートとして保存するため通知する
   * (拡張機能から取得するAPIは存在しないため、スレッド一覧を取得する処理は
   * 拡張機能側からpostMessageで通知される形になる)
   * @param thread
   */
  save: (thread: Thread) => Promise<void>
}

/**
 * 環境に応じたThreadRepositoryを生成して返す
 */
export function defaultThreadRepositoryFactory(): ThreadRepositoryInterface {
  if (isVsCodeEnv()) {
    return new ThreadRepositoryVsCode()
  }

  return new ThreadRepositoryLocalStorage()
}
