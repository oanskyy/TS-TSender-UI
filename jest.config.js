/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ✅ switched from 'node' to 'jsdom'   // Set the test environment to jsdom to simulate browser APIs
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
