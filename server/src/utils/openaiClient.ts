import OpenAI from 'openai'

export type OpenAIClientFactory = (
  apiKey: string,
  tipo: 'openai' | 'deepseek'
) => OpenAI

export const createOpenAIClient: OpenAIClientFactory = (
  apiKey,
  tipo = 'openai'
) => {
  return new OpenAI({
    apiKey,
    baseURL:
      tipo === 'deepseek'
        ? 'https://api.deepseek.com'
        : 'https://api.openai.com'
  })
}
