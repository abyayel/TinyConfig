#!/usr/bin/env node
const { loadConfig, validateWithSchema } = require("../src/index");
const fs = require("fs");
const path = require("path");

function showHelp() {
  console.log(`
TinyConfig CLI v2.0

Commands:
  show           - Display merged configuration
  validate       - Validate config files
  generate-env   - Create .env template file
  check          - Check config for required fields

Examples:
  npx tiny-config show
  npx tiny-config validate
  npx tiny-config generate-env
  npx tiny-config check
`);
}

function showConfig() {
  const config = loadConfig();
  console.log(JSON.stringify(config, null, 2));
}

function validateConfig() {
  try {
    const config = loadConfig();
    console.log("Configuration loaded successfully");
    console.log("Found", Object.keys(config).length, "configuration keys");
    return 0;
  } catch (error) {
    console.error("Validation failed:", error.message);
    return 1;
  }
}

function generateEnvTemplate() {
  const template = `# Environment Variables Template
API_KEY=your_api_key_here
DATABASE_URL=mongodb://localhost:27017/yourdb
DEBUG=true
PORT=3000
NODE_ENV=development

# Add your environment variables below
# Each line should be KEY=VALUE
`;

  fs.writeFileSync(".env.template", template);
  console.log("Created .env.template file");
}

function checkRequiredFields() {
  const config = loadConfig();
  const required = ["API_KEY", "DATABASE_URL"];
  const missing = required.filter((field) => !config[field]);

  if (missing.length > 0) {
    console.error("Missing required fields:", missing.join(", "));
    return 1;
  }

  console.log("All required fields present");
  return 0;
}

// Main execution
const command = process.argv[2];

switch (command) {
  case "show":
    showConfig();
    break;
  case "validate":
    process.exit(validateConfig());
    break;
  case "generate-env":
    generateEnvTemplate();
    break;
  case "check":
    process.exit(checkRequiredFields());
    break;
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;
  default:
    console.error("Unknown command:", command);
    showHelp();
    process.exit(1);
}
