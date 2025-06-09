import OpenAI from 'openai'
import { inject, injectable } from 'tsyringe'
import { OpenAIClientFactory } from '../utils/openaiClient'

@injectable()
export class ResumoService {
  constructor(
    @inject('OpenAIClientFactory') private readonly createClient: OpenAIClientFactory
  ) {}

  async gerarResumo(
    texto: string,
    apiKey: string,
    tipo: 'openai' | 'deepseek' = 'openai'
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
