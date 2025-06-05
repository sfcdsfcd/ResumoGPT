const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

async function initDb() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (err) {
    console.error('Failed to initialize database', err);
    process.exit(1);
  }
}

module.exports = { sequelize, initDb };
