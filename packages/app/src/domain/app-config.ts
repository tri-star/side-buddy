import zod from 'zod'

const proxySettingSchema = zod.object({
  host: zod.string(),
  port: zod.string(),
})

export const appConfigSchema = zod.object({
  apiKey: zod.string().optional(),
  defaultTemperature: zod.number().default(0.0),
  proxy: proxySettingSchema.optional(),
})

export type AppConfig = zod.infer<typeof appConfigSchema>
