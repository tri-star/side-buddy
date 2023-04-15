import zod from 'zod'

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

export const panelMessageSchema = zod.discriminatedUnion('type', [
  loadedSchema,
  logMessageSchema,
  setApiKeySchema,
])

export type PanelMessage = zod.infer<typeof panelMessageSchema>
