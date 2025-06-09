import OpenAI from 'openai'
import { ApiKeyType } from '../types/apiKeyType'

export type OpenAIClientFactory = (
  apiKey: string,
  tipo: ApiKeyType
) => OpenAI

export const createOpenAIClient: OpenAIClientFactory = (
  apiKey,
  tipo = ApiKeyType.OPENAI
) => {
  return new OpenAI({
    apiKey,
    baseURL:
      tipo === ApiKeyType.DEEPSEEK
        ? 'https://api.deepseek.com'
        : 'https://api.openai.com'
  })
}
