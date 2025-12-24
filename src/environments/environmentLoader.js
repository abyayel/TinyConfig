const fs = require("fs");
const path = require("path");
// REMOVE THIS: const { loadConfig } = require('../index');
// We'll require loadConfig inside the function to avoid circular dependency

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

  // Detect by hostname or user (for development)
  // FIX: Added || operator
  if (process.env.USER === "root" || process.env.USERNAME === "Administrator") {
    return "production";
  }

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
  };
}

function loadEnvironmentConfig(env = detectEnvironment(), options = {}) {
  // FIX: Require loadConfig here, not at top (avoids circular dependency)
  const { loadConfig } = require("../index");

  const envFiles = getEnvironmentFiles(env);

  const mergedOptions = {
    envPath: envFiles.envFiles,
    jsonPaths: envFiles.jsonFiles,
    yamlPaths: envFiles.yamlFiles,
    tomlPaths: envFiles.tomlFiles,
    iniPaths: envFiles.iniFiles,
    priority: ["env", "yaml", "json", "toml", "ini"],
    ...options,
  };

  return loadConfig(mergedOptions);
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
