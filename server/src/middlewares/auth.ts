import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing token' })
  }
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, env.jwtSecret) as any
    ;(req as any).userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'invalid token' })
  }
}
