import { NextFunction, Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import User from '../models/user'
import { ResumoService } from '../services/resumo.service'
import { ApiKeyType } from '../types/apiKeyType'

@injectable()
export class ResumoController {
  constructor(private service: ResumoService) {}

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
      const { resumo, tipoUsado } = await this.service.gerarResumo(
        text,
        (user as any).api_key,
        (user as any).api_key_type || ApiKeyType.OPENAI
      )
      res.json({ resumo, tipoUsado })
    } catch (err) {
      next(err)
    }
  }
}

export const resumoController = container.resolve(ResumoController)
