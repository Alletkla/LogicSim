module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: {
        exclude: ['!**/*.(spec|test).ts?(x)'],
      warnOnly: true
      }
    }]
  }
}