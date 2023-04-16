import zod from 'zod'

export const extensionEventTypeSchema = zod.union([
  zod.literal('update-thread'),
  zod.literal('load-thread'),
])

export type ExtensionEventType = zod.infer<typeof extensionEventTypeSchema>
