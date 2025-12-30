const fs = require("fs");
const path = require("path");

/**
 * Create temporary test directory
 */
function createTestDir() {
  const testDir = path.join(__dirname, "fixtures");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  return testDir;
}

/**
 * Clean up test directory
 */
function cleanupTestDir() {
  const testDir = path.join(__dirname, "fixtures");
  if (fs.existsSync(testDir)) {
    fs.readdirSync(testDir).forEach((file) => {
      fs.unlinkSync(path.join(testDir, file));
    });
  }
}

/**
 * Mock process.env for tests
 */
function mockEnv(envVars) {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    Object.keys(envVars).forEach((key) => {
      process.env[key] = envVars[key];
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });
}

module.exports = {
  createTestDir,
  cleanupTestDir,
  mockEnv,
};
