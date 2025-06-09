import { Request, Response, NextFunction } from 'express'
import { container, injectable } from 'tsyringe'
import { AuthService } from '../services/auth.service'

@injectable()
export class AuthController {
  constructor(private service: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, apiKey, tipo } = req.body
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email and password required' })
      }
      await this.service.register(username, email, password, apiKey, tipo)
      res.status(201).json({ message: 'user created' })
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password required' })
      }
      const token = await this.service.login(email, password)
      res.json({ token })
    } catch (err) {
      next(err)
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.service.getCurrentUser((req as any).userId)
      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      }
      res.json({
        username: (user as any).username,
        email: (user as any).email,
        api_key: (user as any).api_key,
        tipoApiKey: (user as any).api_key_type
      })
    } catch (err) {
      next(err)
    }
  }

  async updateApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { apiKey, tipo } = req.body
      if (!apiKey || !tipo) {
        return res.status(400).json({ error: 'apiKey and tipo required' })
      }
      if (tipo !== 'openai' && tipo !== 'deepseek') {
        return res.status(400).json({ error: 'invalid tipo' })
      }
      await this.service.updateApiKey((req as any).userId, apiKey, tipo)
      res.json({ message: 'API Key updated' })
    } catch (err) {
      next(err)
    }
  }
}

export const authController = container.resolve(AuthController)
