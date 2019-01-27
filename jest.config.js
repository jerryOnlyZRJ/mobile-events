module.exports = {
  testURL: 'http://localhost',
  testMatch: ['<rootDir>/test/*.js'],
  coverageDirectory: '<rootDir>/logs/coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
