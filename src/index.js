const { loadEnv } = require("./loaders/envLoader");
const { loadJson } = require("./loaders/jsonLoader");
const { loadYaml } = require("./loaders/yamlLoader");
const { loadToml } = require("./loaders/tomlLoader");
const { loadXml } = require("./loaders/xmlLoader");
const { loadIni } = require("./loaders/iniLoader");

// ALL merge functions from ONE file
const {
  mergeConfigs,
  mergeWithStrategy,
  mergeWithPriorityMap,
  transformValues,
  deepMerge,
} = require("./strategies/advancedMerge");

const {
  validateWithSchema,
  createSchema,
} = require("./validation/schemaValidator");

const {
  detectEnvironment,
  loadEnvironmentConfig,
  getEnvironmentFiles,
  isProduction,
  isDevelopment,
  isTesting,
} = require("./environments/environmentLoader");

function loadConfig(options = {}) {
  const {
    envPath = ".env",
    jsonPaths = "config.json",
    yamlPaths = ["config.yaml", "config.yml"],
    tomlPaths = "config.toml",
    xmlPaths = "config.xml",
    iniPaths = "config.ini",
    priority = ["env", "yaml", "json", "toml", "xml", "ini"],
    mergeStrategy = "merge-deep",
  } = options;

  // Load all configs
  const envConfig = loadEnv(envPath);
  const jsonConfig = loadJson(jsonPaths);
  const yamlConfig = loadYaml(yamlPaths);
  const tomlConfig = loadToml(tomlPaths);
  const xmlConfig = loadXml(xmlPaths);
  const iniConfig = loadIni(iniPaths);

  // Create configs object in priority order (lowest to highest)
  const configsInOrder = [];
  priority.forEach((source) => {
    switch (source) {
      case "env":
        configsInOrder.push(envConfig);
        break;
      case "yaml":
        configsInOrder.push(yamlConfig);
        break;
      case "json":
        configsInOrder.push(jsonConfig);
        break;
      case "toml":
        configsInOrder.push(tomlConfig);
        break;
      case "xml":
        configsInOrder.push(xmlConfig);
        break;
      case "ini":
        configsInOrder.push(iniConfig);
        break;
    }
  });

  // Start with empty object and merge in priority order
  let mergedConfig = {};
  configsInOrder.forEach((config) => {
    mergedConfig = mergeWithStrategy(mergedConfig, config, mergeStrategy);
  });

  return mergedConfig;
}

function tinyConfig(options) {
  return loadConfig(options);
}

// Enhanced environment loading that works with fixed circular dependency
function loadEnvironmentConfigWrapper(env = detectEnvironment(), options = {}) {
  const envInfo = loadEnvironmentConfig(env);
  return loadConfig({
    ...envInfo.options,
    ...options,
  });
}

module.exports = {
  // Core functions
  loadConfig,
  tinyConfig,
  loadEnvironmentConfig: loadEnvironmentConfigWrapper,

  // Advanced merging features
  mergeWithStrategy,
  mergeWithPriorityMap,
  transformValues,
  mergeConfigs,
  deepMerge,

  // Validation
  validateWithSchema,
  createSchema,

  // Environments
  detectEnvironment,
  isProduction,
  isDevelopment,
  isTesting,
  getEnvironmentFiles,

  // File loaders
  loadToml,
  loadXml,
  loadIni,
  loadEnv,
  loadJson,
  loadYaml,
};
