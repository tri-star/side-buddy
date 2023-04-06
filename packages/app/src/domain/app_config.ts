import zod from 'zod'

export const appConfigSchema = zod.object({
  apiKey: zod.string(),
})

export type AppConfig = zod.infer<typeof appConfigSchema>
