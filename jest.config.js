module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|js)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/tests/styleMock.js',
    '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
