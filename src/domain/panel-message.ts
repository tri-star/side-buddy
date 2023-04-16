import zod from 'zod'
import { threadSchema } from './thread'

const loadedSchema = zod.object({
  type: zod.literal('loaded'),
  source: zod.literal('side-buddy-panel'),
})

const logMessageSchema = zod.object({
  type: zod.literal('log'),
  source: zod.literal('side-buddy-panel'),
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
  source: zod.literal('side-buddy-panel'),
  apiKey: zod.string().min(1),
})

const saveThreadListSchema = zod.object({
  type: zod.literal('save-thread'),
  source: zod.literal('side-buddy-panel'),
  thread: threadSchema,
})

const loadThreadSchema = zod.object({
  type: zod.literal('load-thread'),
  source: zod.literal('side-buddy-panel'),
  threadId: zod.string(),
})

// typeが複数になった時にdiscriminateUnionに変更する
// (unionはパターンが1種類の場合エラーになってしまう)
export const panelMessageSchema = zod.discriminatedUnion('type', [
  loadedSchema,
  logMessageSchema,
  setApiKeySchema,
  saveThreadListSchema,
  loadThreadSchema,
])

export type PanelMessage = zod.infer<typeof panelMessageSchema>
