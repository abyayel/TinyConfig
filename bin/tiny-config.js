#!/usr/bin/env node
const {
  loadConfig,
  validateWithSchema,
  detectEnvironment,
} = require("../src/index");
const fs = require("fs");
const path = require("path");

function showHelp() {
  console.log(`
TinyConfig CLI v2.0

Commands:
  show                    Display merged configuration
  validate                Validate config files
  generate-env            Create .env template file
  check                   Check config for required fields
  env <environment>       Show config for specific environment
  list                    List all discovered config files

Examples:
  npx tiny-config show
  npx tiny-config validate
  npx tiny-config generate-env
  npx tiny-config check
  npx tiny-config env production
  npx tiny-config list
`);
}

function showConfig() {
  try {
    const config = loadConfig();
    console.log(JSON.stringify(config, null, 2));
    return 0;
  } catch (error) {
    console.error("Error loading config:", error.message);
    return 1;
  }
}

function validateConfig() {
  try {
    const config = loadConfig();
    console.log("Configuration loaded successfully");
    console.log(`Found ${Object.keys(config).length} configuration keys`);

    // Basic validation check
    if (Object.keys(config).length === 0) {
      console.warn("Warning: Configuration appears to be empty");
    }

    return 0;
  } catch (error) {
    console.error("Validation failed:", error.message);
    return 1;
  }
}

function generateEnvTemplate() {
  const template = `# Environment Variables Template
# Copy this file to .env and fill in your actual values

# Required settings
API_KEY=your_api_key_here
DATABASE_URL=mongodb://localhost:27017/yourdb

# Optional settings
DEBUG=true
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Add your environment variables below
# Each line should be KEY=VALUE
`;

  try {
    fs.writeFileSync(".env.template", template);
    console.log("Created .env.template file");
    return 0;
  } catch (error) {
    console.error("Failed to create .env.template:", error.message);
    return 1;
  }
}

function checkRequiredFields() {
  try {
    const config = loadConfig();
    const required = process.env.REQUIRED_FIELDS
      ? process.env.REQUIRED_FIELDS.split(",")
      : ["API_KEY", "DATABASE_URL"];

    const missing = required.filter((field) => !config[field]);

    if (missing.length > 0) {
      console.error("Missing required fields:", missing.join(", "));
      return 1;
    }

    console.log("All required fields present");
    return 0;
  } catch (error) {
    console.error("Error checking required fields:", error.message);
    return 1;
  }
}

function showEnvironmentConfig(env) {
  try {
    if (!env) {
      env = detectEnvironment();
      console.log(`Using detected environment: ${env}`);
    }

    const config = loadConfig({
      envPath: [`.env.${env}`, ".env"],
      jsonPaths: [`config.${env}.json`, "config.json"],
      yamlPaths: [`config.${env}.yaml`, "config.yaml"],
      tomlPaths: [`config.${env}.toml`, "config.toml"],
      xmlPaths: [`config.${env}.xml`, "config.xml"],
      iniPaths: [`config.${env}.ini`, "config.ini"],
    });

    console.log(`\nEnvironment: ${env}`);
    console.log(JSON.stringify(config, null, 2));
    return 0;
  } catch (error) {
    console.error(
      `Error loading config for environment '${env}':`,
      error.message
    );
    return 1;
  }
}

function listConfigFiles() {
  const env = detectEnvironment();
  console.log(`Current environment: ${env}\n`);

  const files = [
    `.env.${env}`,
    ".env",
    `config.${env}.json`,
    "config.json",
    `config.${env}.yaml`,
    "config.yaml",
    `config.${env}.yml`,
    "config.yml",
    `config.${env}.toml`,
    "config.toml",
    `config.${env}.xml`,
    "config.xml",
    `config.${env}.ini`,
    "config.ini",
  ];

  console.log("Configuration files TinyConfig looks for:");
  files.forEach((file) => {
    const absolutePath = path.resolve(process.cwd(), file);
    const exists = fs.existsSync(absolutePath);
    console.log(
      `  ${exists ? "YES" : "NO"} ${file} ${exists ? "(found)" : "(not found)"}`
    );
  });

  return 0;
}

// Main execution
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case "show":
    process.exit(showConfig());
    break;
  case "validate":
    process.exit(validateConfig());
    break;
  case "generate-env":
    process.exit(generateEnvTemplate());
    break;
  case "check":
    process.exit(checkRequiredFields());
    break;
  case "env":
    process.exit(showEnvironmentConfig(arg));
    break;
  case "list":
    process.exit(listConfigFiles());
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
