const fs = require("fs");
const path = require("path");

function detectEnvironment() {
  // Check NODE_ENV first (standard)
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  // Check common environment variables
  if (process.env.ENVIRONMENT) {
    return process.env.ENVIRONMENT;
  }

  if (process.env.ENV) {
    return process.env.ENV;
  }

  // Remove unreliable username detection - too problematic
  // Default to development
  return "development";
}

function getEnvironmentFiles(env) {
  return {
    envFiles: [`.env.${env}`, ".env.local", ".env"],
    jsonFiles: [`config.${env}.json`, "config.json"],
    yamlFiles: [
      `config.${env}.yaml`,
      `config.${env}.yml`,
      "config.yaml",
      "config.yml",
    ],
    tomlFiles: [`config.${env}.toml`, "config.toml"],
    iniFiles: [`config.${env}.ini`, "config.ini"],
    xmlFiles: [`config.${env}.xml`, "config.xml"],
  };
}

function loadEnvironmentConfig(env = detectEnvironment(), loaders = {}) {
  const envFiles = getEnvironmentFiles(env);

  // Return the file paths and options - let the caller load them
  return {
    env,
    filePaths: envFiles,
    options: {
      envPath: envFiles.envFiles,
      jsonPaths: envFiles.jsonFiles,
      yamlPaths: envFiles.yamlFiles,
      tomlPaths: envFiles.tomlFiles,
      xmlPaths: envFiles.xmlFiles,
      iniPaths: envFiles.iniFiles,
      priority: ["env", "yaml", "json", "toml", "xml", "ini"],
    },
  };
}

function isProduction() {
  const env = detectEnvironment();
  return env === "production" || env === "prod";
}

function isDevelopment() {
  const env = detectEnvironment();
  return env === "development" || env === "dev";
}

function isTesting() {
  const env = detectEnvironment();
  return env === "test" || env === "testing";
}

module.exports = {
  detectEnvironment,
  loadEnvironmentConfig,
  getEnvironmentFiles,
  isProduction,
  isDevelopment,
  isTesting,
};
