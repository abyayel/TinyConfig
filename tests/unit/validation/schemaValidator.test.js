const {
  validateWithSchema,
  createSchema,
} = require("../../../src/validation/schemaValidator");

describe("schemaValidator", () => {
  test("validates required fields", () => {
    const schema = createSchema({
      apiKey: { required: true, type: "string" },
      port: { type: "number", default: 3000 },
    });

    const config = { apiKey: "test-key" };
    const validated = validateWithSchema(config, schema);

    expect(validated.apiKey).toBe("test-key");
    expect(validated.port).toBe(3000); // Default value
  });

  test("throws error for missing required field", () => {
    const schema = createSchema({
      apiKey: { required: true, type: "string" },
    });

    const config = {};

    expect(() => {
      validateWithSchema(config, schema);
    }).toThrow();
  });

  test("validates type constraints", () => {
    const schema = createSchema({
      port: { type: "number", min: 1, max: 65535 },
      host: { type: "string" },
    });

    const config = { port: 3000, host: "localhost" };
    const validated = validateWithSchema(config, schema);

    expect(validated.port).toBe(3000);
    expect(validated.host).toBe("localhost");
  });

  test("validates enum values", () => {
    const schema = createSchema({
      logLevel: { type: "string", enum: ["debug", "info", "warn", "error"] },
    });

    const config = { logLevel: "info" };
    const validated = validateWithSchema(config, schema);
    expect(validated.logLevel).toBe("info");

    const invalidConfig = { logLevel: "invalid" };
    expect(() => validateWithSchema(invalidConfig, schema)).toThrow();
  });
});
