import zod from 'zod'

export const chatRoles = ['system', 'assistant', 'user']
export type ChatRole = (typeof chatRoles)[number]

export const chatRequestSchema = zod.object({
  message: zod.string(),
})

export type ChatRequest = zod.infer<typeof chatRequestSchema>
