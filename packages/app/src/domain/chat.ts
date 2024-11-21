import zod from 'zod'

export const roleSchema = zod.union([
  zod.literal('system'),
  zod.literal('assistant'),
  zod.literal('user'),
])

export const modelSchema = zod.union([
  zod.literal('o1-preview'),
  zod.literal('o1-mini'),
  zod.literal('gpt-4o'),
  zod.literal('gpt-4-turbo'),
  zod.literal('gpt-4-0125-preview'),
  zod.literal('gpt-4-1106-preview'),
  zod.literal('gpt-4'),
  zod.literal('gpt-4o-mini'),
  zod.literal('gpt-4-32k'),
  zod.literal('gpt-3.5-turbo-1106'),
  zod.literal('gpt-3.5-turbo'),
  zod.literal('gpt-3.5-turbo-16k'),
])

export const chatMessageSchema = zod.object({
  id: zod.string().min(1),
  role: roleSchema,
  model: modelSchema,
  message: zod.string().min(1),
})

export const chatRequestSchema = zod.object({
  model: modelSchema,
  temperature: zod.number().min(0).max(2),
  messages: zod.array(chatMessageSchema).min(1),
})

export type ChatRequest = zod.infer<typeof chatRequestSchema>

export type ChatMessage = zod.infer<typeof chatMessageSchema>

export type ChatRole = zod.infer<typeof chatMessageSchema>['role']

export const chatRoles: ChatRole[] = ['system', 'assistant', 'user']

export type ChatModel = zod.infer<typeof modelSchema>

export const chatModels: ChatModel[] = [
  'o1-preview',
  'o1-mini',
  'gpt-4o',
  'gpt-4-turbo',
  'gpt-4-0125-preview',
  'gpt-4-1106-preview',
  'gpt-4',
  'gpt-4o-mini',
] as const

export const DEFAULT_CHAT_MODEL: ChatModel = 'gpt-4o'
