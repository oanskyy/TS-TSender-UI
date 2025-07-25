/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ✅ good for testing browser APIs like DOM, viem, etc
  setupFiles: ['<rootDir>/jest.setup.ts'], // ✅ polyfill goes here
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
