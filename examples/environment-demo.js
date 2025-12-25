const { detectEnvironment, loadEnvironmentConfig } = require("../src/index");

console.log("=== TinyConfig Environment Demo ===");

console.log("\n1. Environment Detection:");
console.log("   Detected environment:", detectEnvironment());
console.log("   NODE_ENV:", process.env.NODE_ENV || "not set");

console.log("\n2. Loading Environment Configuration:");
try {
  const config = loadEnvironmentConfig();
  console.log("   Successfully loaded environment config");
  console.log("   Number of config keys:", Object.keys(config).length);

  // Show sample values
  if (config.server?.port) {
    console.log("   Server port:", config.server.port);
  }
} catch (error) {
  console.log("   Error:", error.message);
}

console.log("\n3. Usage Example:");
console.log("   // In your application:");
console.log("   const { loadEnvironmentConfig } = require('tiny-config');");
console.log("   const config = loadEnvironmentConfig();");
console.log("   // config contains environment-specific settings");

console.log("\n=== Demo Complete ===");
