import 'reflect-metadata'
import { ResumoService } from '../src/services/resumo.service'
import { ApiKeyType } from '../src/types/apiKeyType'

describe('ResumoService fallback', () => {
  it('tries next API when first fails', async () => {
    const client1 = {
      chat: { completions: { create: jest.fn().mockRejectedValue(new Error('x')) } }
    } as any
    const client2 = {
      chat: { completions: { create: jest.fn().mockResolvedValue({ choices: [{ message: { content: 'ok' } }] }) } }
    } as any
    const factory = jest
      .fn()
      .mockReturnValueOnce(client1)
      .mockReturnValueOnce(client2)
    const service = new ResumoService(factory)
    const result = await service.gerarResumo('t', 'key', ApiKeyType.OPENAI)
    expect(result.resumo).toBe('ok')
    expect(result.tipoUsado).toBe(ApiKeyType.DEEPSEEK)
  })
})
