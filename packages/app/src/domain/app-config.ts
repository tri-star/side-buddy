import zod from 'zod'

export const appConfigSchema = zod.object({
  apiKey: zod.string().optional(),
  defaultTemperature: zod.number().default(0.0),
})

export type AppConfig = zod.infer<typeof appConfigSchema>
