/* eslint-disable no-undef */
module.exports = {
  testRegex: '.(spec|test).ts$',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/**/app.module.ts',
    '!<rootDir>/src/**/*protocols.ts',
    '!<rootDir>/src/**/protocols/*.ts',
    '!<rootDir>/src/**/config/**',
  ],
  transform: {
    '.+\\.ts': 'ts-jest',
  },
};
