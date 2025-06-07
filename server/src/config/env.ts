import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const env = {
  port: process.env.PORT || '3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
}
