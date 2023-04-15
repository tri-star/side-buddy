import zod from 'zod'
import { appConfigSchema } from './app-config'
import { threadSchema } from './thread'

const updateConfigSchema = zod.object({
  type: zod.literal('updateConfig'),
  source: zod.literal('side-buddy-extension'),
  config: appConfigSchema,
})

const updateThreadList = zod.object({
  type: zod.literal('update-thread-list'),
  source: zod.literal('side-buddy-extension'),
  threads: zod.array(threadSchema),
})

export const extensionMessageSchema = zod.discriminatedUnion('type', [
  updateConfigSchema,
  updateThreadList,
])

export type ExtensionMessage = zod.infer<typeof extensionMessageSchema>
