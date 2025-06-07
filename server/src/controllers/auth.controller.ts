import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  constructor(private service: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, apiKey } = req.body
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email and password required' })
      }
      await this.service.register(username, email, password, apiKey)
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
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  async updateApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { apiKey } = req.body
      if (!apiKey) {
        return res.status(400).json({ error: 'apiKey required' })
      }
      await this.service.updateApiKey((req as any).userId, apiKey)
      res.json({ message: 'API Key updated' })
    } catch (err) {
      next(err)
    }
  }
}

export const authController = new AuthController(new AuthService())
