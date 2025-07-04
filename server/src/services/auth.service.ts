import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { injectable } from 'tsyringe'
import User from '../models/user'
import { env } from '../config/env'
import { ApiKeyType } from '../types/apiKeyType'

@injectable()
export class AuthService {
  async register(
    username: string,
    email: string,
    password: string,
    apiKey?: string,
    tipo: ApiKeyType = ApiKeyType.OPENAI
  ): Promise<void> {
    const hash = await bcrypt.hash(password, 10)
    await User.create({
      username,
      email,
      password_hash: hash,
      api_key: apiKey || null,
      api_key_type: tipo
    })
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
  async getCurrentUser(userId: number) {
    return User.findByPk(userId, {
      attributes: ['username', 'email', 'api_key', 'api_key_type'],
    })
  }

  async updateApiKey(
    userId: number,
    apiKey: string,
    tipo: ApiKeyType
  ): Promise<void> {
    const user = await User.findByPk(userId)
    if (!user) {
      throw new Error('user not found')
    }
    ;(user as any).api_key = apiKey
    ;(user as any).api_key_type = tipo
    await user.save()
  }
}
