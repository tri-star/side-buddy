import zod from 'zod'

export const chatMessageSchema = zod.object({
  id: zod.string().min(1),
  role: zod.union([
    zod.literal('system'),
    zod.literal('assistant'),
    zod.literal('user'),
  ]),
  message: zod.string().min(1),
})

export const chatRequestSchema = zod.object({
  messages: zod.array(chatMessageSchema).min(1),
})

export type ChatRequest = zod.infer<typeof chatRequestSchema>

export type ChatRole = zod.infer<typeof chatMessageSchema>['role']

export const chatRoles: ChatRole[] = ['system', 'assistant', 'user']