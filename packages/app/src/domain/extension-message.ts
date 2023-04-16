import zod from 'zod'
import { appConfigSchema } from '@/domain/app-config'
import { threadSchema } from './thread'

/**
 * postMessageで通知されるイベントの型
 * (VSCode拡張の時は文字列、ブラウザの場合はオブジェクトで渡されるように見える)
 */
export type PostMessagePayload = {
  data: object | string
}

/**
 * postMessageで通知されるイベントのdata部の中身。
 * VSCode拡張経由の場合は文字列をJson.parseした後のオブジェクトの型
 */
export type PostMessageDataPart = {
  source?: string
}

export const extensionMessageTypes = ['updateConfig']

const updateConfigSchema = zod.object({
  type: zod.literal('updateConfig'),
  source: zod.literal('side-buddy-extension'),
  config: appConfigSchema,
})

const updateThreadListSchema = zod.object({
  type: zod.literal('update-thread-list'),
  source: zod.literal('side-buddy-extension'),
  threads: zod.array(threadSchema),
})

const loadThreadSchema = zod.object({
  type: zod.literal('load-thread'),
  source: zod.literal('side-buddy-extension'),
  thread: threadSchema,
})

export const extensionMessageSchema = zod.discriminatedUnion('type', [
  updateConfigSchema,
  updateThreadListSchema,
  loadThreadSchema,
])

export type ExtensionMessage = zod.infer<typeof extensionMessageSchema>
