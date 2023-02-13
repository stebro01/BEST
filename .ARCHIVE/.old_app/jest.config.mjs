/** @type {import('jest').Config} */
export default {
  setupFilesAfterEnv: ['<rootDir>jest.setup.js'],
  preset: '@quasar/quasar-app-extension-testing-unit-jest',
  // collectCoverage: true,
  // coverageThreshold: {
  //   global: {
  //      branches: 50,
  //      functions: 50,
  //      lines: 50,
  //      statements: 50
  //   },
  // },
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  globals: {
    __DEV__: true,
    // TODO: Remove if resolved natively
    // See https://github.com/vuejs/vue-jest/issues/175
    'vue-jest': {
      pug: { doctype: 'html' },
    },
    
    DB_DEFAULT_PATH: '/Users/ste/MyProjects/dbBEST/dbase/mydb.db',
    DB_TEST_PATH: './test/jest/mockups/testdb.db',
    MOCKUP_PATH: './test/jest/mockups'
  },
};
