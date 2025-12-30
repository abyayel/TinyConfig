const {
  detectEnvironment,
  isProduction,
  isDevelopment,
} = require("../../../src/environments/environmentLoader");

describe("environmentLoader", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("detects NODE_ENV", () => {
    process.env.NODE_ENV = "production";
    expect(detectEnvironment()).toBe("production");
  });

  test("defaults to development", () => {
    delete process.env.NODE_ENV;
    expect(detectEnvironment()).toBe("development");
  });

  test("isProduction returns true for production", () => {
    process.env.NODE_ENV = "production";
    expect(isProduction()).toBe(true);
  });

  test("isDevelopment returns true for development", () => {
    process.env.NODE_ENV = "development";
    expect(isDevelopment()).toBe(true);
  });
});
