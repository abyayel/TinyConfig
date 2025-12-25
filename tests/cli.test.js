const { execSync } = require("child_process");

describe("CLI Tool", () => {
  test("show command returns valid JSON", () => {
    const output = execSync("node bin/tiny-config.js show", {
      encoding: "utf8",
    });
    // Find JSON in output (skip any debug messages)
    const lines = output.split("\n");
    const jsonLine = lines.find((line) => line.trim().startsWith("{"));
    expect(jsonLine).toBeDefined();

    const parsed = JSON.parse(jsonLine);
    expect(typeof parsed).toBe("object");
  });

  test("validate command runs without error", () => {
    const output = execSync("node bin/tiny-config.js validate", {
      encoding: "utf8",
    });
    expect(output).toContain("Configuration loaded");
  });

  test("generate-env creates template file", () => {
    execSync("node bin/tiny-config.js generate-env", { encoding: "utf8" });
    const fs = require("fs");
    expect(fs.existsSync(".env.template")).toBe(true);
    fs.unlinkSync(".env.template");
  });
});
