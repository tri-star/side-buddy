import {
  type PostMessagePayload,
  type ExtensionMessage,
  type PostMessageDataPart,
} from '@/domain/extension-message'
import { type Thread, threadSchema } from '@/domain/thread'
import { getLogger } from '@/logging/logger'
import { ZodError } from 'zod'

// TODO: ExtensionBridgeとしてクラスを利用した実装に変更する。
//       その時、Bridgeクラス内でメッセージ送受信を行い、
//       公開するメソッドはVSCode拡張を意識しない形にする。

/**
 * VSCodeの外で動作する環境用にスタブ実装を起動する。
 * (開発時などに利用。)
 */
export async function startExtensionStubThreadList() {
  // 1秒待つ
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const threads = localStorage.getItem('threads')
  let threadList: Thread[] = []
  if (threads != null) {
    threadList = (JSON.parse(threads) as unknown[]).map((t: unknown) => {
      return threadSchema.parse(t)
    })
  }

  // 設定情報を通知する
  const message: ExtensionMessage = {
    type: 'update-thread-list',
    source: 'side-buddy-extension',
    threads: threadList,
  }

  window.postMessage(message)

  window.addEventListener('message', (event: PostMessagePayload) => {
    try {
      let data = event.data as PostMessageDataPart
      if (typeof data === 'string') {
        data = JSON.parse(data) as PostMessageDataPart
      }

      if (String(data.source ?? '').startsWith('react-devtools')) {
        // React dev toolsからの通知は対象外
        return
      }

      // const message = panelMessageSchema.parse(data)

      // switch (message.type) {
      // }
    } catch (e) {
      if (e instanceof ZodError) {
        let dataString = event.data
        if (typeof dataString === 'object') {
          dataString = JSON.stringify(dataString)
        }
        getLogger().warn(
          'Event parse error: \nEvent: ' +
            dataString +
            '\nError:' +
            e.toString()
        )
      } else {
        throw e
      }
    }
  })
}
