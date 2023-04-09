import zod from 'zod'
import { appConfigSchema } from '@/domain/app-config'

export type PostMessagePayload = {
  data: object | string
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
