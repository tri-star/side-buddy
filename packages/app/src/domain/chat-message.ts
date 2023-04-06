import zod from 'zod'

export const chatMessageSchema = zod.object({
  message: zod.string(),
})

export type ChatMessage = zod.infer<typeof chatMessageSchema>
