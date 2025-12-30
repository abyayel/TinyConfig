const { loadIni, parseIniContent } = require("../../../src/loaders/iniLoader");
const fs = require("fs");
const path = require("path");

describe("iniLoader", () => {
  const testDir = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    fs.writeFileSync(
      path.join(testDir, "test-config.ini"),
      "[database]\nhost=localhost\nport=5432\n\n[redis]\nhost=127.0.0.1\nport=6379"
    );
  });

  afterEach(() => {
    if (fs.existsSync(path.join(testDir, "test-config.ini"))) {
      fs.unlinkSync(path.join(testDir, "test-config.ini"));
    }
  });

  test("parses INI content correctly", () => {
    const content = "[section]\nkey=value\nanother=test";
    const config = parseIniContent(content);
    expect(config.section.key).toBe("value");
    expect(config.section.another).toBe("test");
  });

  test("handles sections without values", () => {
    const content = "[database]\n[redis]\nport=6379";
    const config = parseIniContent(content);
    expect(config.database).toEqual({});
    expect(config.redis.port).toBe("6379");
  });

  test("loads INI file", () => {
    const config = loadIni(path.join(testDir, "test-config.ini"));
    expect(config.database.host).toBe("localhost");
    expect(config.redis.port).toBe("6379");
  });

  test("removes quotes from values", () => {
    const content = "[test]\nkey=\"quoted value\"\nanother='single quoted'";
    const config = parseIniContent(content);
    expect(config.test.key).toBe("quoted value");
    expect(config.test.another).toBe("single quoted");
  });
});
