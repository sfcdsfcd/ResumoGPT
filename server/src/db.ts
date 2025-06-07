import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
  }
)

export async function initDb(): Promise<void> {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database synchronized')
  } catch (err) {
    console.error('Failed to initialize database', err)
    process.exit(1)
  }
}
