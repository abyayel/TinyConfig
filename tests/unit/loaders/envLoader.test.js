const { loadEnv } = require("../../../src/loaders/envLoader");
const fs = require("fs");
const path = require("path");

describe("envLoader", () => {
  const testDir = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(path.join(testDir, "test.env"))) {
      fs.unlinkSync(path.join(testDir, "test.env"));
    }
  });

  test("loads .env file", () => {
    fs.writeFileSync(path.join(testDir, "test.env"), "TEST_KEY=test_value");

    const config = loadEnv(path.join(testDir, "test.env"));
    expect(config.TEST_KEY).toBe("test_value");
  });

  test("handles multiple .env files", () => {
    fs.writeFileSync(path.join(testDir, "env1.env"), "KEY1=value1");
    fs.writeFileSync(path.join(testDir, "env2.env"), "KEY2=value2");

    const config = loadEnv([
      path.join(testDir, "env1.env"),
      path.join(testDir, "env2.env"),
    ]);

    expect(config.KEY1).toBe("value1");
    expect(config.KEY2).toBe("value2");

    fs.unlinkSync(path.join(testDir, "env1.env"));
    fs.unlinkSync(path.join(testDir, "env2.env"));
  });
});
