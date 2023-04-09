import zod from 'zod'
import { appConfigSchema } from './app-config'

export const appStateSchema = zod.object({
  config: appConfigSchema.optional(),
})

export type AppState = zod.infer<typeof appStateSchema>
