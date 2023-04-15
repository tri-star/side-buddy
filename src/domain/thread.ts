import zod from 'zod'
import { chatMessageSchema } from './chat'

export const threadSchema = zod.object({
  id: zod.string(),
  title: zod.string().optional(),
  messages: zod.array(chatMessageSchema),
})

export type Thread = zod.infer<typeof threadSchema>
