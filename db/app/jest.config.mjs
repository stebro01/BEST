/** @type {import('jest').Config} */
export default {
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

  // ADDEB BY SB
  setupFilesAfterEnv: ['<rootDir>jest.setup.js'],
  globals: {
    __DEV__: true,
    // TODO: Remove if resolved natively
    // See https://github.com/vuejs/vue-jest/issues/175
    'vue-jest': {
      pug: { doctype: 'html' },
    },
    
    DB_DEFAULT_PATH: '/Users/ste/MyProjects/dbBEST/dbase/mydb.db',
    DB_TEST_PATH: './test/jest/mockups/db/test_db_import.db',
    DB_MAIN_PATH: './test/jest/mockups/db_main.db',
    DB_SECONDARY_PATH: './test/jest/mockups/db_secondary.db',
    MOCKUP_PATH: './test/jest/mockups'
  },
};
