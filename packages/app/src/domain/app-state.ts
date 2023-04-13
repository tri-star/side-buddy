import zod from 'zod'
import { appConfigSchema } from './app-config'
import { roleSchema } from './chat'

export const appStateSchema = zod.object({
  config: appConfigSchema.optional(),
  role: roleSchema,
  message: zod.string(),
})

export type AppState = zod.infer<typeof appStateSchema>
