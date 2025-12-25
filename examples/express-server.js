const { loadEnvironmentConfig, validateWithSchema } = require("../src/index");

console.log("=== TinyConfig Express Server Example ===");
console.log("Example configuration for a web server");

try {
  // 1. Load environment-specific config
  const config = loadEnvironmentConfig();
  console.log(
    "\n1. Loaded configuration for environment:",
    process.env.NODE_ENV || "development"
  );

  // 2. Define validation schema
  const serverSchema = {
    server: {
      port: { required: true, type: "number", min: 1024, max: 65535 },
      host: { required: false, type: "string", default: "localhost" },
    },
  };

  // 3. Validate
  validateWithSchema(config, serverSchema);
  console.log("2. Configuration validated");

  // 4. Show how to use in Express (pseudo-code)
  console.log("\n3. Usage in Express application:");
  console.log(`
   const express = require('express');
   const { loadEnvironmentConfig } = require('tiny-config');
   
   const config = loadEnvironmentConfig();
   const app = express();
   
   app.get('/', (req, res) => {
     res.json({
       server: config.server,
       environment: process.env.NODE_ENV
     });
   });
   
   app.listen(config.server.port, () => {
     console.log('Server running on port', config.server.port);
   });
  `);

  console.log("\n4. Current config values:");
  console.log("   Server port:", config.server?.port || "Not set");
  console.log("   Server host:", config.server?.host || "localhost");
} catch (error) {
  console.log("Error:", error.message);
  console.log("\nTo run this example properly:");
  console.log("1. Set NODE_ENV (development, test, production)");
  console.log("2. Create environment-specific config files");
  console.log("   Example: .env.development, config.development.yaml");
}

console.log("\n=== Example Complete ===");
