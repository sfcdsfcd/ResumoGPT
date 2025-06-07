import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const env = {
  port: process.env.PORT || '3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  jwtSecret: (() => {
    if (!process.env.JWT_SECRET) {
      throw new Error('Environment variable JWT_SECRET is required but not provided.');
    }
    return process.env.JWT_SECRET;
  })(),
}
