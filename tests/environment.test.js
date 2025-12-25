const {
  detectEnvironment,
  loadEnvironmentConfig,
  isProduction,
  isDevelopment,
} = require("../src/index");

describe("Environment Features", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("detects production environment", () => {
    process.env.NODE_ENV = "production";
    expect(detectEnvironment()).toBe("production");
    expect(isProduction()).toBe(true);
    expect(isDevelopment()).toBe(false);
  });

  test("detects development environment by default", () => {
    delete process.env.NODE_ENV;
    expect(detectEnvironment()).toBe("development");
    expect(isDevelopment()).toBe(true);
  });

  test("loadEnvironmentConfig returns object", () => {
    const config = loadEnvironmentConfig("development");
    expect(typeof config).toBe("object");
  });

  test("handles different environments", () => {
    process.env.NODE_ENV = "test";
    expect(detectEnvironment()).toBe("test");
  });
});
