import { type ChatRequest } from '@/domain/chat'

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
  choices: ChatCompletionResponseChoice[]
}

export async function* requestChatCompletion(
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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: request.role,
          content: request.message,
        },
      ],
      temperature: request.temperature,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 100,
      stream: true,
    }),
  })

  if (response == null || response.body == null) {
    throw new Error('response is null')
  }

  const decoder = new TextDecoder()
  const reader = response.body.getReader()

  let stopper = 100000
  while (true && stopper > 0) {
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
