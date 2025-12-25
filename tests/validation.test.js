const { validateWithSchema } = require("../src/index");

describe("Schema Validation", () => {
  test("validates required fields", () => {
    const config = { API_KEY: "test123", server: { port: 3000 } };
    const schema = {
      API_KEY: { required: true, type: "string" },
      server: { port: { type: "number" } },
    };

    expect(() => validateWithSchema(config, schema)).not.toThrow();
  });

  test("throws on missing required field", () => {
    const config = { server: { port: 3000 } };
    const schema = {
      API_KEY: { required: true, type: "string" },
    };

    expect(() => validateWithSchema(config, schema)).toThrow();
  });

  test("validates types", () => {
    const config = { port: "3000" }; // String instead of number
    const schema = { port: { type: "number" } };

    expect(() => validateWithSchema(config, schema)).toThrow();
  });

  test("sets default values", () => {
    const config = {};
    const schema = {
      port: { required: false, type: "number", default: 3000 },
    };

    const result = validateWithSchema(config, schema);
    expect(result.port).toBe(3000);
  });
});
