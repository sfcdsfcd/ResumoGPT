import { Request, Response, NextFunction } from 'express'
import { ResumoService } from '../services/resumo.service'
import { createOpenAIClient } from '../utils/openaiClient'

export class ResumoController {
  async resumir(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, apiKey } = req.body
      if (!text || !apiKey) {
        return res.status(400).json({ error: 'text and apiKey required' })
      }
      const service = new ResumoService(createOpenAIClient(apiKey))
      const resumo = await service.gerarResumo(text)
      res.json({ resumo })
    } catch (err) {
      next(err)
    }
  }
}

export const resumoController = new ResumoController()
