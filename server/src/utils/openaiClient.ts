import OpenAI from 'openai'

export const createOpenAIClient = (apiKey: string) => {
  return new OpenAI({ apiKey })
}
