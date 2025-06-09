import OpenAI from 'openai'

export const createOpenAIClient = (apiKey: string, tipo: 'openai' | 'deepseek' = 'openai') => {
  return new OpenAI({
    apiKey,
    baseURL: tipo === 'deepseek' ? 'https://api.deepseek.com' : 'https://api.openai.com'
  })
}
