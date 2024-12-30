import zod from 'zod'

export const modelSchema = zod.union([
  zod.literal('o1'),
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
  role: zod.union([
    zod.literal('system'),
    zod.literal('assistant'),
    zod.literal('user'),
  ]),
  model: modelSchema,
  message: zod.string().min(1),
})
