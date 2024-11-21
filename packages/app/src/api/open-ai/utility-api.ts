import { type ChatModel } from '@/domain/chat'
import { fetchChatResponse } from './chat-api'

/**
 * 渡した文字列に対するタイトルを生成する
 * @param apiKey
 * @param message
 * @param temperature
 */
export const fetchTitleFromMessage = async (
  apiKey: string,
  message: string,
  model: ChatModel,
  temperature = 0.5
) => {
  const prompt =
    '以下のメッセージに対するタイトルを生成してください。\n\nメッセージ:\n' +
    message +
    '\n\nタイトル:\n'

  const response = await fetchChatResponse(apiKey, {
    temperature,
    model: model === 'o1-preview' ? 'gpt-4o' : model,
    messages: [
      {
        id: 'title',
        role: 'user',
        model,
        message: prompt,
      },
    ],
  })

  return response.choices[0].message.content
}
