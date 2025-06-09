import OpenAI from 'openai'
import { inject, injectable } from 'tsyringe'
import { OpenAIClientFactory } from '../utils/openaiClient'
import { ApiKeyType } from '../types/apiKeyType'

@injectable()
export class ResumoService {
  constructor(
    @inject('OpenAIClientFactory') private readonly createClient: OpenAIClientFactory
  ) {}

  async gerarResumo(
    texto: string,
    apiKey: string,
    tipo: ApiKeyType = ApiKeyType.OPENAI
  ): Promise<string> {
    const client = this.createClient(apiKey, tipo)
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Resuma o texto a seguir em até 5 frases.' },
        { role: 'user', content: texto },
      ],
    })
    return completion.choices[0]?.message?.content?.trim() || ''
  }
}
