// tests/integration/priorityMerging.test.js
const { loadConfig } = require("../../src/index");
const fs = require("fs");
const path = require("path");

describe("Priority Merging", () => {
  const testDir = path.join(__dirname, "../fixtures");

  afterEach(() => {
    // Clean up
    [".env", "test.yaml", "test.json", "test.ini"].forEach((file) => {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
  });

  test("env overrides yaml overrides json overrides ini for same key path", () => {
    // All files have the SAME key at the SAME path
    fs.writeFileSync(path.join(testDir, ".env"), "API_KEY=env-value");

    fs.writeFileSync(
      path.join(testDir, "test.yaml"),
      "API_KEY: yaml-value\nserver:\n  port: 8000"
    );

    fs.writeFileSync(
      path.join(testDir, "test.json"),
      JSON.stringify({ API_KEY: "json-value", server: { port: 7000 } })
    );

    fs.writeFileSync(
      path.join(testDir, "test.ini"),
      "API_KEY=ini-value\n[server]\nport=6000"
    );

    const config = loadConfig({
      envPath: path.join(testDir, ".env"),
      jsonPaths: path.join(testDir, "test.json"),
      yamlPaths: path.join(testDir, "test.yaml"),
      iniPaths: path.join(testDir, "test.ini"),
    });

    // .env should win for API_KEY (highest priority)
    expect(config.API_KEY).toBe("env-value");

    // For server.port: YAML > JSON > INI
    // YAML: 8000, JSON: 7000, INI: 6000
    // YAML should win
    expect(config.server.port).toBe(8000);
  });
});
