// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['src', '<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage',
    '.*\\.entity\\.ts$',
    '.*\\.dto\\.ts$',
    '.*\\.module\\.ts$',
    '.*\\.guard\\.ts$',
    'main.ts',
    '.eslintrc.js',
    'jest.config.js',
  ],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  verbose: true,
  modulePaths: ['test', 'src', '<rootDir>'],
};

module.exports = config;
