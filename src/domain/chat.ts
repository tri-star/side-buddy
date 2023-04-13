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
