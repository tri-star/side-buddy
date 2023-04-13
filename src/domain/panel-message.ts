import zod from 'zod'
import { chatMessageSchema } from './chat'

const loadedSchema = zod.object({
  type: zod.literal('loaded'),
})

const logMessageSchema = zod.object({
  type: zod.literal('log'),
  level: zod.union([
    zod.literal('debug'),
    zod.literal('info'),
    zod.literal('warn'),
    zod.literal('error'),
  ]),
  message: zod.string(),
})

const setApiKeySchema = zod.object({
  type: zod.literal('set-api-key'),
  apiKey: zod.string().min(1),
})

const addThreadMessageSchema = zod.object({
  type: zod.literal('add-thread-message'),
  message: chatMessageSchema,
})

// typeが複数になった時にdiscriminateUnionに変更する
// (unionはパターンが1種類の場合エラーになってしまう)
export const panelMessageSchema = zod.discriminatedUnion('type', [
  loadedSchema,
  logMessageSchema,
  setApiKeySchema,
  addThreadMessageSchema,
])

export type PanelMessage = zod.infer<typeof panelMessageSchema>
