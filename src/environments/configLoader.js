const { loadConfig } = require("../core");

const { detectEnvironment } = require("./environmentDetector");

/**
 * Private helper to generate environment-specific file lists.
 * @param {string} env - The environment name.
 * @returns {Object} Object containing arrays of file paths for env, json, and yaml.
 */
function getEnvironmentFiles(env) {
  return {
    envPaths: [`.env.${env}.local`, `.env.${env}`, ".env.local", ".env"],
    jsonPaths: [`config.${env}.json`, "config.json"],
    yamlPaths: [
      `config.${env}.yaml`,
      `config.${env}.yml`,
      "config.yaml",
      "config.yml",
    ],
  };
}

/**
 * Loads environment-specific configuration files (e.g., config.production.json).
 *
 * This function generates a list of potential configuration files based on the detected
 * or provided environment and attempts to load them using the core configuration loader.
 *
 * Supported file types: .env, .json, .yaml, .yml
 *
 * @param {string} [env=null] - The environment name (e.g., 'production'). If omitted, it will be auto-detected.
 * @returns {Object} The merged configuration object from environment-specific files.
 */
function loadEnvironmentConfig(env = null) {
  // Use provided env OR detect it
  const environment = env || detectEnvironment();

  console.log(`🌍 Loading configuration for: ${environment.toUpperCase()}`);

  const files = getEnvironmentFiles(environment);

  // Load with specific priority for this environment
  return loadConfig({
    envPath: files.envPaths,
    jsonPaths: files.jsonPaths,
    yamlPaths: files.yamlPaths,
    priority: ["env", "yaml", "json"],
  });
}

module.exports = { loadEnvironmentConfig };
