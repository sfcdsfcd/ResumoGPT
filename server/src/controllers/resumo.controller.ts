import { Request, Response, NextFunction } from 'express'
import { ResumoService } from '../services/resumo.service'
import { createOpenAIClient } from '../utils/openaiClient'
import User from '../models/user'

export class ResumoController {
  async resumir(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body
      if (!text) {
        return res.status(400).json({ error: 'text required' })
      }
      const user = await User.findByPk((req as any).userId)
      if (!user || !(user as any).api_key) {
        return res.status(400).json({ error: 'API key not configured' })
      }
      const service = new ResumoService(createOpenAIClient((user as any).api_key))
      const resumo = await service.gerarResumo(text)
      res.json({ resumo })
    } catch (err) {
      next(err)
    }
  }

  async summarize(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body
      if (!text) {
        return res.status(400).json({ error: 'text required' })
      }
      const user = await User.findByPk((req as any).userId)
      if (!user || !(user as any).api_key) {
        return res.status(400).json({ error: 'API key not configured' })
      }
      const service = new ResumoService(createOpenAIClient((user as any).api_key))
      const summary = await service.gerarResumo(text)
      res.json({ summary })
    } catch (err) {
      next(err)
    }
  }
}

export const resumoController = new ResumoController()
