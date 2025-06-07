import OpenAI from 'openai'

export class ResumoService {
  constructor(private client: OpenAI) {}

  async gerarResumo(texto: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Resuma o texto a seguir em até 5 frases.' },
        { role: 'user', content: texto },
      ],
    })
    return completion.choices[0]?.message?.content?.trim() || ''
  }
}
