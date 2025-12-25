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
  } = options;

  const envConfig = loadEnv(envPath);
  const jsonConfig = loadJson(jsonPaths);
  const yamlConfig = loadYaml(yamlPaths);
  const tomlConfig = loadToml(tomlPaths);
  const xmlConfig = loadXml(xmlPaths);
  const iniConfig = loadIni(iniPaths);

  return mergeConfigs(
    {
      env: envConfig,
      yaml: yamlConfig,
      json: jsonConfig,
      toml: tomlConfig,
      xml: xmlConfig,
      ini: iniConfig,
    },
    priority
  );
}

function tinyConfig(options) {
  return loadConfig(options);
}

module.exports = {
  // Core functions
  loadConfig,
  tinyConfig,

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
  loadEnvironmentConfig,
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
