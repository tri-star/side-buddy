import zod from 'zod'
import { appConfigSchema } from './app-config'

const updateConfigSchema = zod.object({
  type: zod.literal('updateConfig'),
  source: zod.literal('side-buddy-extension'),
  config: appConfigSchema,
})

// typeが複数になった時にunionに変更する
// (unionはパターンが1種類の場合エラーになってしまう)
export const extensionMessageSchema = updateConfigSchema

export type ExtensionMessage = zod.infer<typeof extensionMessageSchema>
