const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

describe("CLI", () => {
  const testDir = path.join(__dirname, "../fixtures");
  const cliPath = path.join(__dirname, "../../bin/tiny-config");

  beforeEach(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(path.join(__dirname, "../.."));
  });

  test("--help shows usage", () => {
    const output = execSync(`node "${cliPath}" --help`).toString();
    expect(output).toContain("Commands:");
    expect(output).toContain("Examples:");
  });

  test("list shows available files", () => {
    fs.writeFileSync(".env", "TEST=value");
    fs.writeFileSync("config.json", "{}");

    const output = execSync(`node "${cliPath}" list`).toString();
    expect(output).toContain("Current environment:");
    expect(output).toContain(".env");

    fs.unlinkSync(".env");
    fs.unlinkSync("config.json");
  });
});
