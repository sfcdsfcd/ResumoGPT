process.env.JWT_SECRET = 'secret'
import 'reflect-metadata'
import { AuthController } from '../src/controllers/auth.controller'
import { AuthService } from '../src/services/auth.service'
import { ApiKeyType } from '../src/types/apiKeyType'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('AuthController register', () => {
  let controller: AuthController
  let service: jest.Mocked<AuthService>

  beforeEach(() => {
    service = {
      register: jest.fn().mockResolvedValue(undefined),
    } as any
    controller = new AuthController(service)
  })

  test('invalid tipo returns 400', async () => {
    const req: any = { body: { username: 'a', email: 'b', password: 'c', tipo: 'x' } }
    const res = mockRes()
    await controller.register(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('register with OPENAI', async () => {
    const req: any = { body: { username: 'a', email: 'b', password: 'c', tipo: ApiKeyType.OPENAI } }
    const res = mockRes()
    await controller.register(req, res, jest.fn())
    expect(service.register).toHaveBeenCalledWith('a', 'b', 'c', undefined, ApiKeyType.OPENAI)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('register with DEEPSEEK', async () => {
    const req: any = { body: { username: 'a', email: 'b', password: 'c', tipo: ApiKeyType.DEEPSEEK } }
    const res = mockRes()
    await controller.register(req, res, jest.fn())
    expect(service.register).toHaveBeenCalledWith('a', 'b', 'c', undefined, ApiKeyType.DEEPSEEK)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('register without apiKey and tipo uses default', async () => {
    const req: any = { body: { username: 'a', email: 'b', password: 'c' } }
    const res = mockRes()
    await controller.register(req, res, jest.fn())
    expect(service.register).toHaveBeenCalledWith('a', 'b', 'c', undefined, ApiKeyType.OPENAI)
    expect(res.status).toHaveBeenCalledWith(201)
  })
})

describe('AuthController updateApiKey', () => {
  let controller: AuthController
  let service: jest.Mocked<AuthService>

  beforeEach(() => {
    service = {
      updateApiKey: jest.fn().mockResolvedValue(undefined),
    } as any
    controller = new AuthController(service)
  })

  test('missing params returns 400', async () => {
    const req: any = { body: { apiKey: 'k' }, userId: 1 }
    const res = mockRes()
    await controller.updateApiKey(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('invalid tipo returns 400', async () => {
    const req: any = { body: { apiKey: 'k', tipo: 'x' }, userId: 1 }
    const res = mockRes()
    await controller.updateApiKey(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('valid update', async () => {
    const req: any = { body: { apiKey: 'k', tipo: ApiKeyType.OPENAI }, userId: 1 }
    const res = mockRes()
    await controller.updateApiKey(req, res, jest.fn())
    expect(service.updateApiKey).toHaveBeenCalledWith(1, 'k', ApiKeyType.OPENAI)
    expect(res.json).toHaveBeenCalledWith({ message: 'API Key updated' })
  })
})
