import { DEFAULT_CHAT_MODEL, type ChatRequest } from '@/domain/chat'

/*
{
  "id": "chatcmpl-73RfaaECQ5GS87lrUqtDU1hmhzgW8",
  "object": "chat.completion.chunk",
  "created": 1681055702,
  "model": "gpt-3.5-turbo-0301",
  "choices": [
    { "delta": { "content": "テ" }, "index": 0, "finish_reason": null }
  ]
}
*/

type ChatCompletionResponseChoice = {
  message: {
    role: string
    content: string
  }
  index: number
  finish_reason: string | null
}

type ChatCompletionResponseEntry = {
  id: string
  object: string
  created: number
  model: string
  // usege: // トークンの使用状況のオブジェクトが入る。現在未使用
  choices: ChatCompletionResponseChoice[]
}

type ChatCompletionResponseStreamChoice = {
  delta?: {
    role?: string
    content?: string
  }
  index: number
  finish_reason: string | null
}

type ChatCompletionResponseStreamEntry = {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionResponseStreamChoice[]
}

/**
 * チャットの返答をそのままレスポンスとして返す
 * @param apiKey
 * @param request
 */
export async function fetchChatResponse(
  apiKey: string,
  request: ChatRequest
): Promise<ChatCompletionResponseEntry> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_CHAT_MODEL,
      messages: request.messages.map((message) => ({
        role: message.role,
        content: message.message,
      })),
      temperature: request.temperature,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1000,
    }),
  })

  if (response?.body == null) {
    throw new Error('response is null')
  }

  return (await response.json()) as ChatCompletionResponseEntry
}

/**
 * チャットの返答をstreamとしてgeneratorで生成する
 * @param apiKey
 * @param request
 */
export async function* gernerateChatStream(
  apiKey: string,
  request: ChatRequest
) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages.map((message) => ({
        role: message.role,
        content: message.message,
      })),
      temperature: request.temperature,
      frequency_penalty: 0,
      presence_penalty: 0,
      // max_tokens: 1000, // TODO: 最大トークン数は外から指定する
      stream: true,
    }),
  })

  if (response?.body == null) {
    throw new Error('response is null')
  }

  const decoder = new TextDecoder()
  const reader = response.body.getReader()

  // TODO: ServerSentEventのレスポンスをパースする処理は独立させテストを実装する
  let stopper = 100000
  while (stopper > 0) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    try {
      const lines = decoder
        .decode(value)
        .split('\n')
        .filter((line: string) => line.trim().startsWith('data: '))

      for (const rawline of lines) {
        const line = rawline.replace(/^data: /, '')
        if (line === '[DONE]') {
          return
        }

        const streamEntry = JSON.parse(
          line.replace(/^data: /, '')
        ) as ChatCompletionResponseStreamEntry

        for (const choice of streamEntry.choices) {
          if (choice.finish_reason != null) {
            // eslint-disable-next-line max-depth -- TODO
            if (choice.finish_reason !== 'stop') {
              console.info(choice)
            }
            return
          }
          if (choice.delta?.content != null) {
            yield choice.delta.content
          }
        }
      }
    } catch (e) {
      console.error(decoder.decode(value))
      console.error(e)
    }

    stopper -= 1
  }
}
