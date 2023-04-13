import zod from 'zod'

export const roleSchema = zod.union([
  zod.literal('system'),
  zod.literal('assistant'),
  zod.literal('user'),
])

export const chatMessageSchema = zod.object({
  id: zod.string().min(1),
  role: roleSchema,
  message: zod.string().min(1),
})

export const chatRequestSchema = zod.object({
  messages: zod.array(chatMessageSchema).min(1),
})

export type ChatRequest = zod.infer<typeof chatRequestSchema>

export type ChatMessage = zod.infer<typeof chatMessageSchema>

export type ChatRole = zod.infer<typeof chatMessageSchema>['role']

export const chatRoles: ChatRole[] = ['system', 'assistant', 'user']
