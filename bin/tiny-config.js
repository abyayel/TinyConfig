#!/usr/bin/env node
const { loadConfig } = require("../src/index");
const fs = require("fs");
const path = require("path");

function showHelp() {
  console.log(`
TinyConfig CLI

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

function detectEnvironment() {
  return process.env.NODE_ENV || "development";
}

function filterSystemEnvVars(config) {
  const filtered = {};

  Object.keys(config).forEach((key) => {
    const isSystemVar =
      key === "OS" ||
      key === "Path" ||
      key === "ProgramData" ||
      key === "ProgramFiles" ||
      key === "ProgramFiles(x86)" ||
      key === "ProgramW6432" ||
      key === "SystemDrive" ||
      key === "TMP" ||
      key === "USERNAME" ||
      key.startsWith("npm_") ||
      key.includes("PROCESSOR") ||
      key.includes("SESSION") ||
      key.includes("USERDOMAIN") ||
      key.includes("USERPROFILE") ||
      key.includes("COMPUTERNAME") ||
      key.includes("WINDIR");

    const isConfigData = typeof config[key] === "object";

    const isEnvVar =
      key === "NODE_ENV" ||
      key === "PORT" ||
      key === "LOG_LEVEL" ||
      key === "API_KEY" ||
      key === "DATABASE_URL" ||
      key === "REDIS_URL" ||
      key === "JWT_SECRET" ||
      key.includes("_URL") ||
      key.includes("_KEY") ||
      key.includes("_SECRET");

    if (isConfigData || isEnvVar || !isSystemVar) {
      filtered[key] = config[key];
    }
  });

  return filtered;
}

function showConfig() {
  try {
    const config = loadConfig({
      envPath: "config/.env",
      jsonPaths: "config/config.json",
      yamlPaths: "config/config.yaml",
      iniPaths: "config/database.ini",
    });

    const filteredConfig = filterSystemEnvVars(config);
    console.log(JSON.stringify(filteredConfig, null, 2));
    return 0;
  } catch (error) {
    console.error("Error loading config:", error.message);
    return 1;
  }
}

function validateConfig() {
  try {
    const config = loadConfig({
      envPath: "config/.env",
      jsonPaths: "config/config.json",
      yamlPaths: "config/config.yaml",
      iniPaths: "config/database.ini",
    });

    const filteredConfig = filterSystemEnvVars(config);
    console.log("✓ Configuration loaded successfully");
    console.log(
      `✓ Found ${Object.keys(filteredConfig).length} configuration keys`
    );

    const configKeys = Object.keys(filteredConfig);
    if (configKeys.length === 0) {
      console.warn("⚠ Warning: No configuration loaded from files");
    } else {
      const fileBasedKeys = configKeys.filter(
        (k) => typeof filteredConfig[k] === "object"
      );
      console.log(
        `✓ Loaded ${fileBasedKeys.length} configuration sections from files`
      );
    }

    return 0;
  } catch (error) {
    console.error("✗ Validation failed:", error.message);
    return 1;
  }
}

function generateEnvTemplate() {
  const template = `# Environment Variables Template
# Copy this file to config/.env and fill in your actual values

NODE_ENV=development
PORT=3000
LOG_LEVEL=info
API_KEY=your_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/database
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
`;

  try {
    fs.writeFileSync("config/.env.example", template);
    console.log("✓ Created config/.env.example file");
    return 0;
  } catch (error) {
    console.error("✗ Failed to create .env.example:", error.message);
    return 1;
  }
}

function checkRequiredFields() {
  try {
    const config = loadConfig({
      envPath: "config/.env",
      jsonPaths: "config/config.json",
      yamlPaths: "config/config.yaml",
      iniPaths: "config/database.ini",
    });

    const required = ["API_KEY", "DATABASE_URL"];
    const missing = required.filter((field) => !config[field]);

    if (missing.length > 0) {
      console.error("✗ Missing required fields:", missing.join(", "));
      console.log("   Run 'tiny-config generate-env' to create a template");
      return 1;
    }

    console.log("✓ All required fields present");
    return 0;
  } catch (error) {
    console.error("✗ Error checking required fields:", error.message);
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
      envPath: [`config/.env.${env}`, "config/.env"],
      jsonPaths: [`config/config.${env}.json`, "config/config.json"],
      yamlPaths: [`config/config.${env}.yaml`, "config/config.yaml"],
      iniPaths: [`config/database.${env}.ini`, "config/database.ini"],
    });

    const filteredConfig = filterSystemEnvVars(config);
    console.log(`\nEnvironment: ${env}`);
    console.log(JSON.stringify(filteredConfig, null, 2));
    return 0;
  } catch (error) {
    console.error(
      `✗ Error loading config for environment '${env}':`,
      error.message
    );
    return 1;
  }
}

function listConfigFiles() {
  const env = detectEnvironment();
  console.log(`Current environment: ${env}\n`);

  const files = [
    `config/.env.${env}`,
    "config/.env",
    `config/config.${env}.json`,
    "config/config.json",
    `config/config.${env}.yaml`,
    "config/config.yaml",
    `config/config.${env}.yml`,
    "config/config.yml",
    `config/database.${env}.ini`,
    "config/database.ini",
  ];

  console.log("Configuration files TinyConfig looks for:");
  let foundCount = 0;
  files.forEach((file) => {
    const absolutePath = path.resolve(process.cwd(), file);
    const exists = fs.existsSync(absolutePath);
    if (exists) foundCount++;
    console.log(`  ${exists ? "✓" : "✗"} ${file}`);
  });

  console.log(`\nFound ${foundCount} of ${files.length} config files`);
  return 0;
}

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
