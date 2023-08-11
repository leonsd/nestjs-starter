/* eslint-disable no-undef */
module.exports = {
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*protocols.ts',
    '!<rootDir>/src/**/protocols/*.ts',
    '!<rootDir>/src/**/config/**',
  ],
  transform: {
    '.+\\.ts': 'ts-jest',
  },
};
