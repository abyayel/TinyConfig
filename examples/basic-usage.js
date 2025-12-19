const { loadConfig } = require("../src/index");

console.log("=== TinyConfig Demo ===\n");
console.log("Loading configuration from example files...\n");

// Load with our specific example files
const config = loadConfig({
  envPath: ".env.example", // We use .env.example instead of .env
  jsonPaths: "config.json", // Original json file
  yamlPaths: "config.yaml", // Original yaml file
});

console.log("Merged Configuration:");
console.log(JSON.stringify(config, null, 2));

console.log("\n--- Accessing Specific Values ---");
console.log("API Key:", config.API_KEY);
console.log("Server Port:", config.server?.port);
console.log("Database URL:", config.DATABASE_URL);
console.log("Cache Feature:", config.features?.cache);

console.log("\n--- Priority Demonstration ---");
console.log("Notice:");
console.log('1. API_KEY = "my_secret_key_123" from .env.example');
console.log(
  "2. server.port = 8080 from config.yaml (overrides config.json's 3000)"
);
console.log(
  "3. features.cache = false from config.yaml (overrides config.json's true)"
);
console.log("4. features.analytics = true from config.yaml (not in json)");
console.log("5. features.logging = false from config.json (not in yaml)");

console.log("\n=== Demo Complete ===");
