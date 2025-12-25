const {
  loadConfig,
  loadEnvironmentConfig,
  validateWithSchema,
} = require("../src/index");

console.log("=== TinyConfig Advanced CLI Example ===");
console.log("Demonstrating programmatic usage of TinyConfig");

// Example 1: Basic loading
console.log("\n1. Basic Configuration Loading:");
const config = loadConfig();
console.log("   Loaded", Object.keys(config).length, "configuration keys");

// Example 2: Environment-specific config
console.log("\n2. Environment-Specific Configuration:");
const envConfig = loadEnvironmentConfig();
console.log("   Environment:", process.env.NODE_ENV || "development");
console.log("   Config loaded successfully");

// Example 3: Validation
console.log("\n3. Schema Validation:");
try {
  const schema = {
    API_KEY: { required: true, type: "string" },
    server: { port: { type: "number" } },
  };
  validateWithSchema(config, schema);
  console.log("   Validation passed");
} catch (error) {
  console.log("   Validation error:", error.message);
}

// Example 4: Accessing values
console.log("\n4. Accessing Configuration Values:");
if (config.server) {
  console.log("   Server port:", config.server.port || "Not set");
}
if (config.API_KEY) {
  console.log("   API key present:", config.API_KEY ? "Yes" : "No");
}

console.log("\n=== Example Complete ===");
console.log("This shows how to use TinyConfig programmatically in CLI tools.");
