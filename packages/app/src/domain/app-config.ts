import zod from 'zod'

export const appConfigSchema = zod.object({
  apiKey: zod.string(),
  defaultTemperature: zod.number().default(0.0),
})

export type AppConfig = zod.infer<typeof appConfigSchema>
