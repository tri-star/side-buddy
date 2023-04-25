import {
  type PostMessagePayload,
  type ExtensionMessage,
  type PostMessageDataPart,
} from '@/domain/extension-message'
import { panelMessageSchema } from '@/domain/panel-message'
import { getLogger } from '@/logging/logger'
import { ZodError } from 'zod'

/**
 * VSCodeの外で動作する環境用にスタブ実装を起動する。
 * (開発時などに利用。)
 */
export async function startExtensionStub() {
  // 1秒待つ
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const config = {
    apiKey: window.localStorage.getItem('apiKey') ?? '',
    defaultTemperature: parseFloat(
      import.meta.env.VITE_APP_CONFIG_DEFAULT_TEMPERATURE ?? '0.0'
    ),
  }

  // 設定情報を通知する
  const message: ExtensionMessage = {
    type: 'updateConfig',
    source: 'side-buddy-extension',
    config,
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

      const message = panelMessageSchema.parse(data)

      switch (message.type) {
        case 'set-api-key':
          // APIキーの設定を受け付けたら、Panel側に設定更新を通知する
          config.apiKey = message.apiKey
          window.postMessage({
            type: 'updateConfig',
            source: 'side-buddy-extension',
            config,
          } satisfies ExtensionMessage)
          break
      }
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

// sidebarのstubに求められる機能
// - スタート時に設定情報をロードして保持
// - set-api-key メッセージを受け取ったら、updateConfigで設定情報を通知する
