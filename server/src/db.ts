import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import path from 'path'

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

async function runMigrations() {
  const umzug = new Umzug({
    migrations: { glob: path.join(__dirname, '../migrations/*.js') },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  })
  await umzug.up()
}

export async function initDb(): Promise<void> {
  try {
    await sequelize.authenticate()
    if (process.env.APPLY_MIGRATIONS === 'true') {
      await runMigrations()
    }
    console.log('Database connected')
  } catch (err) {
    console.error('Failed to initialize database', err)
    process.exit(1)
  }
}
