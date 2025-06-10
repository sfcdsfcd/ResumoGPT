import 'reflect-metadata'
import { container } from 'tsyringe'
import { AuthService } from './services/auth.service'
import { ResumoService } from './services/resumo.service'
import { createOpenAIClient, OpenAIClientFactory } from './utils/openaiClient'

container.registerSingleton(AuthService)
container.registerSingleton(ResumoService)
container.register<OpenAIClientFactory>('OpenAIClientFactory', {
  useValue: createOpenAIClient,
})

export { container }
