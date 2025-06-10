'use strict'

module.exports = {
  // Umzug passes the QueryInterface instance via the `context` option.
  // Destructure it to access Sequelize helpers like `addColumn`.
  up: async ({ context: queryInterface, Sequelize }) => {
    await queryInterface.addColumn('users', 'api_key_type', {
      type: Sequelize.ENUM('openai', 'deepseek'),
      allowNull: false,
      defaultValue: 'openai',
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'api_key_type')
    // Enum types are not dropped automatically when removing the column.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_api_key_type"'
    )
  },
}
