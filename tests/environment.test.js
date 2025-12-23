const {
  detectEnvironment,
  clearCache,
  isProduction,
  isDevelopment,
  isTesting,
} = require("../src/environments/environmentDetector");

const { loadEnvironmentConfig } = require("../src/environments/configLoader");

describe("Environment Detection", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    clearCache(); // Ensure each test starts with a fresh state
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("detects production from NODE_ENV", () => {
    process.env.NODE_ENV = "production";
    expect(detectEnvironment()).toBe("production");
    expect(isProduction()).toBe(true);
    expect(isDevelopment()).toBe(false);
  });

  test("detects development by default", () => {
    delete process.env.NODE_ENV;
    delete process.env.ENVIRONMENT;
    delete process.env.ENV;

    expect(detectEnvironment()).toBe("development");
    expect(isDevelopment()).toBe(true);
  });

  test("detects test from TESTING variable", () => {
    delete process.env.NODE_ENV;
    process.env.ENVIRONMENT = "testing";
    expect(detectEnvironment()).toBe("test");
    expect(isTesting()).toBe(true);
  });

  test("normalizes aliases (prod -> production)", () => {
    process.env.NODE_ENV = "prod";
    expect(detectEnvironment()).toBe("production");
    expect(isProduction()).toBe(true);
  });

  test("caches the detected environment", () => {
    process.env.NODE_ENV = "production";
    expect(detectEnvironment()).toBe("production");

    process.env.NODE_ENV = "development";
    // Should still be production due to caching
    expect(detectEnvironment()).toBe("production");

    // Should refresh if requested
    expect(detectEnvironment({ refresh: true })).toBe("development");
  });

  test("clearCache() resets the state", () => {
    process.env.NODE_ENV = "production";
    detectEnvironment();

    clearCache();
    process.env.NODE_ENV = "development";
    expect(detectEnvironment()).toBe("development");
  });

  test("ignores insecure HOSTNAME heuristic", () => {
    delete process.env.NODE_ENV;
    process.env.HOSTNAME = "app-prod-01";
    // Should default to development now that HOSTNAME is ignored
    expect(detectEnvironment()).toBe("development");
  });

  test("handles non-standard environments (staging)", () => {
    delete process.env.NODE_ENV;
    process.env.ENVIRONMENT = "staging";
    expect(detectEnvironment()).toBe("staging");
  });

  test("handles whitespace and casing", () => {
    process.env.NODE_ENV = " PRODUCTION ";
    expect(detectEnvironment()).toBe("production");
  });

  test("defaults to development on empty string", () => {
    process.env.NODE_ENV = "";
    expect(detectEnvironment({ refresh: true })).toBe("development");
  });

  test("handles suspicious strings with warnings but no override", () => {
    // Spy on console.warn to verify warnings are issued
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    process.env.NODE_ENV = "null";
    const result = detectEnvironment({ refresh: true });

    expect(result).toBe("null"); // No override anymore
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '[TinyConfig] Detected suspicious environment string: "null"'
      )
    );

    consoleSpy.mockRestore();
  });

  test("handles undefined (deleted) env vars gracefully", () => {
    delete process.env.NODE_ENV;
    expect(detectEnvironment({ refresh: true })).toBe("development");
  });
});

describe("Environment Config Loading", () => {
  test("loads config without crashing", () => {
    const config = loadEnvironmentConfig("development");
    expect(typeof config).toBe("object");
  });

  test("handles missing environment files gracefully", () => {
    const config = loadEnvironmentConfig("nonexistent_env");
    expect(typeof config).toBe("object");
  });
});
