import zod from 'zod'
import { appConfigSchema } from './app-config'
import { threadSchema } from './thread'

const updateConfigSchema = zod.object({
  type: zod.literal('updateConfig'),
  source: zod.literal('side-buddy-extension'),
  config: appConfigSchema,
})

const updateThreadListSchema = zod.object({
  type: zod.literal('update-thread-list'),
  source: zod.literal('side-buddy-extension'),
  threads: zod.array(threadSchema),
})

const loadThreadSchema = zod.object({
  type: zod.literal('load-thread'),
  source: zod.literal('side-buddy-extension'),
  thread: threadSchema,
})

export const extensionMessageSchema = zod.discriminatedUnion('type', [
  updateConfigSchema,
  updateThreadListSchema,
  loadThreadSchema,
])

export type ExtensionMessage = zod.infer<typeof extensionMessageSchema>
