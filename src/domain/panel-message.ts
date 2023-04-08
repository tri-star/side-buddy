import zod from 'zod'

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

// typeが複数になった時にdiscriminateUnionに変更する
// (unionはパターンが1種類の場合エラーになってしまう)
export const panelMessageSchema = zod.discriminatedUnion('type', [
  loadedSchema,
  logMessageSchema,
])

export type PanelMessage = zod.infer<typeof panelMessageSchema>
