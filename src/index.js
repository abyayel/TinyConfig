const { loadEnv } = require("./loaders/envLoader");
const { loadJson } = require("./loaders/jsonLoader");
const { loadYaml } = require("./loaders/yamlLoader");
const { loadToml } = require("./loaders/tomlLoader"); // NEW
const { loadXml } = require("./loaders/xmlLoader"); // NEW
const { loadIni } = require("./loaders/iniLoader"); // NEW
const { mergeConfigs } = require("./mergeStrategies");
const {
  mergeWithStrategy,
  mergeWithPriorityMap,
  transformValues,
} = require("./strategies/advancedMerge"); // NEW
const {
  validateWithSchema,
  createSchema,
} = require("./validation/schemaValidator"); // NEW
const {
  detectEnvironment,
  loadEnvironmentConfig,
  getEnvironmentFiles,
  isProduction,
  isDevelopment,
  isTesting,
} = require("./environments/environmentLoader"); // NEW

function loadConfig(options = {}) {
  const {
    envPath = ".env",
    jsonPaths = "config.json",
    yamlPaths = ["config.yaml", "config.yml"],
    tomlPaths = "config.toml", // NEW
    xmlPaths = "config.xml", // NEW
    iniPaths = "config.ini", // NEW
    priority = ["env", "yaml", "json", "toml", "xml", "ini"], // UPDATED
  } = options;

  const envConfig = loadEnv(envPath);
  const jsonConfig = loadJson(jsonPaths);
  const yamlConfig = loadYaml(yamlPaths);
  const tomlConfig = loadToml(tomlPaths); // NEW
  const xmlConfig = loadXml(xmlPaths); // NEW
  const iniConfig = loadIni(iniPaths); // NEW

  return mergeConfigs(
    {
      env: envConfig,
      yaml: yamlConfig,
      json: jsonConfig,
      toml: tomlConfig, // NEW
      xml: xmlConfig, // NEW
      ini: iniConfig, // NEW
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

  // Advanced features (NEW)
  mergeWithStrategy,
  mergeWithPriorityMap,
  transformValues,
  validateWithSchema,
  createSchema,
  detectEnvironment,
  loadEnvironmentConfig,
  isProduction,
  isDevelopment,
  isTesting,
  getEnvironmentFiles,

  // File loaders (NEW)
  loadToml,
  loadXml,
  loadIni,

  // Original loaders
  loadEnv,
  loadJson,
  loadYaml,
  mergeConfigs,
};
