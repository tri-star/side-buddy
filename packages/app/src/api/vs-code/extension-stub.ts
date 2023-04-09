import { type ExtensionMessage } from '@/domain/extension-message'

/**
 * VSCodeの外で動作する環境用にスタブ実装を起動する。
 * (開発時などに利用。)
 */
export async function startExtensionStub() {
  // 1秒待つ
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 設定情報を通知する
  const message: ExtensionMessage = {
    type: 'updateConfig',
    config: {
      // 後で、VITE_ から始まる環境変数を読み込むようにする
      apiKey: import.meta.env.VITE_APP_CONFIG_OPEN_API_KEY,
      defaultTemperature:
        import.meta.env.VITE_APP_CONFIG_DEFAULT_TEMPERATURE ?? 0.0,
    },
  }

  window.postMessage(message)
}
