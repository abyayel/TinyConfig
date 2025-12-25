const {
  loadEnv,
  loadJson,
  loadYaml,
  loadIni,
  loadToml,
  loadXml,
} = require("../src/index");

describe("File Loaders", () => {
  test("loadEnv loads environment variables", () => {
    const env = loadEnv(".env.example");
    expect(env.API_KEY).toBe("my_secret_key_123");
    expect(env.DATABASE_URL).toBe("mongodb://localhost:27017/mydb");
  });

  test("loadJson loads JSON config", () => {
    const config = loadJson("config.json");
    expect(config.server.port).toBe(3000);
    expect(config.features.cache).toBe(true);
  });

  test("loadYaml loads YAML config", () => {
    const config = loadYaml("config.yaml");
    expect(config.server.port).toBe(8080);
    expect(config.features.cache).toBe(false);
  });

  test("loadIni loads INI config", () => {
    const config = loadIni("config.ini");
    expect(typeof config).toBe("object");
  });

  test("loadToml handles missing packages gracefully", () => {
    const config = loadToml("config.toml");
    expect(typeof config).toBe("object");
  });

  test("loadXml handles missing packages gracefully", () => {
    const config = loadXml("config.xml");
    expect(typeof config).toBe("object");
  });

  test("loaders handle missing files gracefully", () => {
    const jsonConfig = loadJson("missing.json");
    expect(jsonConfig).toEqual({});

    const yamlConfig = loadYaml("missing.yaml");
    expect(yamlConfig).toEqual({});
  });
});
