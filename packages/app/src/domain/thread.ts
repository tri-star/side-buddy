import zod from 'zod'
import { chatMessageSchema } from './chat'
import { ulid } from 'ulid'

export const threadSchema = zod.object({
  id: zod.string(),
  title: zod.string().optional(),
  messages: zod.array(chatMessageSchema),
})

export type Thread = zod.infer<typeof threadSchema>

export function createNewThread() {
  return {
    id: ulid(),
    title: '',
    messages: [],
  }
}
