import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { env } from '../config/env'

export class AuthService {
  async register(username: string, email: string, password: string, apiKey?: string): Promise<void> {
    const hash = await bcrypt.hash(password, 10)
    await User.create({ username, email, password_hash: hash, api_key: apiKey || null })
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ where: { email } }) as any
    if (!user) {
      throw new Error('invalid credentials')
    }
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      throw new Error('invalid credentials')
    }
    return jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '1h' })
  }
}
