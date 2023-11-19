import zod from 'zod'
import { appConfigSchema } from './app-config'
import { modelSchema, roleSchema } from './chat'
import { threadSchema } from './thread'

export const appStateSchema = zod.object({
  config: appConfigSchema.optional(),
  role: roleSchema,
  model: modelSchema,
  temperature: zod.number(),
  message: zod.string(),
  thread: threadSchema,
})

export type AppState = zod.infer<typeof appStateSchema>
