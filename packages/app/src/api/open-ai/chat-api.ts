import { type ChatRequest } from '@/domain/chat'

type ChatCompletionCallback = (chunk: string) => void

export async function requestChatCompletion(
  apiKey: string,
  request: ChatRequest,
  callback: ChatCompletionCallback
): Promise<void> {
  const response = await fetch(
    'https://api.openai.com/v1/engines/davinci/completions',
    {
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
        stream: true,
      }),
    }
  )

  if (response == null || response.body == null) {
    throw new Error('response is null')
  }

  const decoder = new TextDecoder()
  const reader = response.body.getReader()

  let data: ReadableStreamReadResult<Uint8Array>
  let stopper = 100000
  while (true && stopper > 0) {
    data = await reader.read()
    if (data.done) {
      break
    }
    callback(decoder.decode(data.value))
    stopper -= 1
  }
}
