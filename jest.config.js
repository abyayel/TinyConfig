// jest.config.js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "TinyConfig/src/**/*.js",
    "!TinyConfig/src/**/*.test.js",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};
