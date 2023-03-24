module.exports = {
  passWithNoTests: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/src/**/*.test.ts(x)?"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {tsconfig: "<rootDir>/tsconfig.jest.json"}],
  },
}
