import { DataTypes } from 'sequelize'
import { sequelize } from '../db'

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
}, {
  tableName: 'users',
  timestamps: false,
})

export default User
