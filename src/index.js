const {
  loadConfig,
  tinyConfig,
  loadEnv,
  loadJson,
  loadYaml,
  mergeConfigs,
} = require("./core");

// Export both named and default exports
module.exports = {
  loadConfig,
  tinyConfig,
};

// Default export
module.exports.default = tinyConfig;

// Environment support
const {
  detectEnvironment,
  isProduction,
  isDevelopment,
  isTesting,
  clearCache,
} = require("./environments/environmentDetector");
const { loadEnvironmentConfig } = require("./environments/configLoader");

module.exports.detectEnvironment = detectEnvironment;
module.exports.isProduction = isProduction;
module.exports.isDevelopment = isDevelopment;
module.exports.isTesting = isTesting;
module.exports.clearCache = clearCache;
module.exports.loadEnvironmentConfig = loadEnvironmentConfig;
