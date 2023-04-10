import zod from 'zod'
import { appConfigSchema } from '@/domain/app-config'

/**
 * postMessageで通知されるイベントの型
 * (VSCode拡張の時は文字列、ブラウザの場合はオブジェクトで渡されるように見える)
 */
export type PostMessagePayload = {
  data: object | string
}

/**
 * postMessageで通知されるイベントのdata部の中身。
 * VSCode拡張経由の場合は文字列をJson.parseした後のオブジェクトの型
 */
export type PostMessageDataPart = {
  source?: string
}

export const extensionMessageTypes = ['updateConfig']

const updateConfigSchema = zod.object({
  type: zod.literal('updateConfig'),
  config: appConfigSchema,
})

// typeが複数になった時にdiscriminateUnionに変更する
// (unionはパターンが1種類の場合エラーになってしまう)
export const extensionMessageSchema = updateConfigSchema

export type ExtensionMessage = zod.infer<typeof extensionMessageSchema>
