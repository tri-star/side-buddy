import zod from 'zod'
import { appConfigSchema } from './app-config'

export const appStateSchema = zod.object({
  apiKeyLoaded: zod.boolean().nullable().default(null),
  config: appConfigSchema,
})

export type AppState = zod.infer<typeof appStateSchema>
