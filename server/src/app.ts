import express from 'express'
import cors from 'cors'
import resumoRoutes from './routes/resumo.routes'
import authRoutes from './routes/auth.routes'
import { errorHandler } from './middlewares/errorHandler'
import { env } from './config/env'

export function createApp() {
  const app = express()
  app.use(express.json())

  if (env.allowedOrigins) {
    app.use(cors({ origin: env.allowedOrigins.split(',') }))
  } else {
    app.use(cors())
  }

  app.use('/api', authRoutes)
  app.use('/api', resumoRoutes)
  app.use(errorHandler)

  return app
}
