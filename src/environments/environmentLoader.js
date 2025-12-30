const path = require("path");

function detectEnvironment() {
  // Check the most common environment variables in order
  return (
    process.env.NODE_ENV ||
    process.env.ENVIRONMENT ||
    process.env.ENV ||
    "development"
  );
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

function loadEnvironmentConfig(env = detectEnvironment()) {
  const envFiles = getEnvironmentFiles(env);

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

const isEnvironment = (env) => detectEnvironment() === env;

module.exports = {
  detectEnvironment,
  loadEnvironmentConfig,
  getEnvironmentFiles,
  isProduction: () => isEnvironment("production") || isEnvironment("prod"),
  isDevelopment: () => isEnvironment("development") || isEnvironment("dev"),
  isTesting: () => isEnvironment("test") || isEnvironment("testing"),
};
