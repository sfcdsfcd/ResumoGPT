import OpenAI from 'openai'
import { ApiKeyType } from '../types/apiKeyType'

export type OpenAIClientFactory = (
  apiKey: string,
  tipo: ApiKeyType
) => OpenAI

export function createOpenAIClient(
  apiKey: string,
  tipo: ApiKeyType = ApiKeyType.OPENAI
): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL:
      tipo === ApiKeyType.DEEPSEEK
        ? 'https://api.deepseek.com'
        : 'https://api.openai.com'
  })
}

export const openAIClientFactory: OpenAIClientFactory = createOpenAIClient
