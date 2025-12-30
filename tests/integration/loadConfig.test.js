// tests/integration/loadConfig.test.js
const { loadConfig } = require("../../src/index");
const fs = require("fs");
const path = require("path");

describe("loadConfig Integration", () => {
  const testDir = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    // Create test config files (NO TOML)
    fs.writeFileSync(
      path.join(testDir, ".env"),
      "API_KEY=secret123\nNODE_ENV=test"
    );

    fs.writeFileSync(
      path.join(testDir, "config.yaml"),
      "server:\n  port: 3000\n  host: localhost"
    );

    fs.writeFileSync(
      path.join(testDir, "config.json"),
      JSON.stringify({
        api: { version: "1.0.0" },
        features: { cache: true },
      })
    );

    fs.writeFileSync(
      path.join(testDir, "config.ini"),
      "[database]\nhost=localhost\n\n[redis]\nhost=127.0.0.1"
    );
  });

  afterEach(() => {
    // Clean up
    [".env", "config.yaml", "config.json", "config.ini"].forEach((file) => {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  });

  test("loads from all file types", () => {
    const config = loadConfig({
      envPath: path.join(testDir, ".env"),
      jsonPaths: path.join(testDir, "config.json"),
      yamlPaths: path.join(testDir, "config.yaml"),
      iniPaths: path.join(testDir, "config.ini"),
    });

    // All config should be loaded
    expect(config.API_KEY).toBe("secret123");
    expect(config.server.port).toBe(3000);
    expect(config.database.host).toBe("localhost");
    expect(config.redis.host).toBe("127.0.0.1");
    expect(config.api.version).toBe("1.0.0");
    expect(config.features.cache).toBe(true);
  });
});
