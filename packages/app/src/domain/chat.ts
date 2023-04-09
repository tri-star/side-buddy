import zod from 'zod'

export const chatRequestSchema = zod.object({
  role: zod.union([
    zod.literal('system'),
    zod.literal('assistant'),
    zod.literal('user'),
  ]),
  temperature: zod.number().min(0.0).max(1.0),
  message: zod.string().min(1),
})

export type ChatRequest = zod.infer<typeof chatRequestSchema>

export type ChatRole = zod.infer<typeof chatRequestSchema>['role']

export const chatRoles: ChatRole[] = ['system', 'assistant', 'user']
