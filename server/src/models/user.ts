import { DataTypes } from 'sequelize'
import { sequelize } from '../db'
import { ApiKeyType } from '../types/apiKeyType'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  api_key: {
    type: DataTypes.TEXT,
  },
  api_key_type: {
    type: DataTypes.ENUM(ApiKeyType.OPENAI, ApiKeyType.DEEPSEEK),
    allowNull: false,
    defaultValue: ApiKeyType.OPENAI,
  },
}, {
  tableName: 'users',
  timestamps: false,
})

export default User
