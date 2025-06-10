'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("CREATE TYPE IF NOT EXISTS api_key_type_enum AS ENUM ('openai','deepseek')")
    await queryInterface.addColumn('users', 'api_key_type', {
      type: Sequelize.ENUM('openai', 'deepseek'),
      allowNull: false,
      defaultValue: 'openai'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'api_key_type')
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS api_key_type_enum')
  }
}
