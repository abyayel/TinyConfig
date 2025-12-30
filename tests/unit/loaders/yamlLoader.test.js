const { loadIni } = require("../../../src/loaders/iniloader");
const fs = require("fs");
const path = require("path");

describe("iniLoader", () => {
  const testDir = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(path.join(testDir, "test.ini"))) {
      fs.unlinkSync(path.join(testDir, "test.ini"));
    }
  });

  test("loads INI file", () => {
    fs.writeFileSync(
      path.join(testDir, "test.ini"),
      "[database]\nhost=localhost\nport=5432\n\n[redis]\nhost=127.0.0.1"
    );

    const config = loadIni(path.join(testDir, "test.ini"));
    expect(config.database.host).toBe("localhost");
    expect(config.database.port).toBe("5432");
    expect(config.redis.host).toBe("127.0.0.1");
  });

  test("handles sections without values", () => {
    fs.writeFileSync(
      path.join(testDir, "test.ini"),
      "[database]\n\n[redis]\nport=6379"
    );

    const config = loadIni(path.join(testDir, "test.ini"));
    expect(config.database).toEqual({});
    expect(config.redis.port).toBe("6379");
  });
});
