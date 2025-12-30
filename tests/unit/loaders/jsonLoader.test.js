const { loadJson } = require("../../../src/loaders/jsonLoader");
const fs = require("fs");
const path = require("path");

describe("jsonLoader", () => {
  const testDir = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up all possible test files
    const testFiles = [
      "test1.json",
      "test2.json",
      "config.json",
      "invalid.json",
    ];
    testFiles.forEach((file) => {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  test("loads a simple JSON file", () => {
    fs.writeFileSync(
      path.join(testDir, "test1.json"),
      JSON.stringify({ port: 3000, host: "localhost" })
    );

    const config = loadJson(path.join(testDir, "test1.json"));
    expect(config.port).toBe(3000);
    expect(config.host).toBe("localhost");
  });

  test("loads JSON file with nested objects", () => {
    fs.writeFileSync(
      path.join(testDir, "test1.json"),
      JSON.stringify({
        server: { port: 3000, host: "localhost" },
        database: { name: "testdb" },
      })
    );

    const config = loadJson(path.join(testDir, "test1.json"));
    expect(config.server.port).toBe(3000);
    expect(config.server.host).toBe("localhost");
    expect(config.database.name).toBe("testdb");
  });

  test("shallow merges multiple JSON files (later files win)", () => {
    // First file
    fs.writeFileSync(
      path.join(testDir, "test1.json"),
      JSON.stringify({
        port: 3000,
        host: "localhost",
        features: { cache: true },
      })
    );

    // Second file (overrides some keys)
    fs.writeFileSync(
      path.join(testDir, "test2.json"),
      JSON.stringify({
        port: 8080, // Overrides port
        debug: true, // Adds new key
        // Note: features is not included, so it will be kept from first file
      })
    );

    const config = loadJson([
      path.join(testDir, "test1.json"),
      path.join(testDir, "test2.json"),
    ]);

    expect(config.port).toBe(8080); // From test2.json (overridden)
    expect(config.host).toBe("localhost"); // From test1.json (kept)
    expect(config.debug).toBe(true); // From test2.json (new)
    expect(config.features.cache).toBe(true); // From test1.json (kept)
  });

  test("shallow merge replaces entire nested objects", () => {
    // This demonstrates the shallow merge behavior
    fs.writeFileSync(
      path.join(testDir, "test1.json"),
      JSON.stringify({
        server: { port: 3000, host: "localhost", timeout: 30 },
      })
    );

    fs.writeFileSync(
      path.join(testDir, "test2.json"),
      JSON.stringify({
        server: { port: 8080 }, // Only has port, replaces entire server object
      })
    );

    const config = loadJson([
      path.join(testDir, "test1.json"),
      path.join(testDir, "test2.json"),
    ]);

    // Shallow merge: entire server object is replaced
    expect(config.server.port).toBe(8080); // From test2.json
    expect(config.server.host).toBeUndefined(); // Lost! Was only in test1.json
    expect(config.server.timeout).toBeUndefined(); // Lost! Was only in test1.json
  });

  test("returns empty object for non-existent file", () => {
    const config = loadJson("non-existent.json");
    expect(config).toEqual({});
  });

  test("handles invalid JSON gracefully", () => {
    fs.writeFileSync(
      path.join(testDir, "invalid.json"),
      "{ this is not valid json"
    );

    // Mock console.warn to suppress output during test
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation();

    const config = loadJson(path.join(testDir, "invalid.json"));

    expect(config).toEqual({});
    expect(console.warn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  test("works with default filename", () => {
    fs.writeFileSync(
      path.join(testDir, "config.json"),
      JSON.stringify({ default: true, value: 42 })
    );

    // Change working directory to testDir for this test
    const originalCwd = process.cwd();
    process.chdir(testDir);

    const config = loadJson(); // Uses default "config.json"
    expect(config.default).toBe(true);
    expect(config.value).toBe(42);

    process.chdir(originalCwd);
  });
});
