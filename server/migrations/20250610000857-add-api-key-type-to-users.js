const { Sequelize } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'api_key_type', {
    type: Sequelize.ENUM('openai', 'deepseek'),
    allowNull: false,
    defaultValue: 'openai',
  })
}
async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'api_key_type')
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_users_api_key_type"'
  )
}

module.exports = {
  up, down
}
