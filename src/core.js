const { loadEnv } = require("./loaders/envLoader");
const { loadJson } = require("./loaders/jsonLoader");
const { loadYaml } = require("./loaders/yamlLoader");
const { mergeConfigs } = require("./mergeStrategies");

/**
 * Load and merge configuration from multiple sources
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.envPath - Path(s) to .env file(s)
 * @param {string|string[]} options.jsonPaths - Path(s) to JSON config file(s)
 * @param {string|string[]} options.yamlPaths - Path(s) to YAML config file(s)
 * @param {string[]} options.priority - Merge priority order
 * @returns {Object} Merged configuration object
 */
function loadConfig(options = {}) {
  const {
    envPath = ".env",
    jsonPaths = "config.json",
    yamlPaths = ["config.yaml", "config.yml"],
    priority = ["env", "yaml", "json"], // Priority: env overrides yaml overrides json
  } = options;

  // Load from all sources
  const envConfig = loadEnv(envPath);
  const jsonConfig = loadJson(jsonPaths);
  const yamlConfig = loadYaml(yamlPaths);

  // Merge with priority
  return mergeConfigs(
    {
      env: envConfig,
      yaml: yamlConfig,
      json: jsonConfig,
    },
    priority
  );
}

/**
 * Simple alias for loadConfig
 */
function tinyConfig(options) {
  return loadConfig(options);
}

module.exports = {
  loadConfig,
  tinyConfig,
  loadEnv,
  loadJson,
  loadYaml,
  mergeConfigs,
};
