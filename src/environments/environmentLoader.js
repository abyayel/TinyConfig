const { loadConfig } = require("../index");

/**
 * Detects the current runtime environment.
 *
 * The function checks standard environment variables such as `NODE_ENV`,
 * `ENVIRONMENT`, and `ENV` to determine the runtime environment.
 * If none of these variables are set, it defaults to 'development'.
 *
 * @returns {string} The name of the detected environment (e.g., 'development', 'production', 'test').
 */
function getTrimmedEnvVar(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function detectEnvironment() {
  // Check NODE_ENV first (standard)
  const nodeEnv = getTrimmedEnvVar("NODE_ENV");
  if (nodeEnv) {
    return nodeEnv;
  }

  // Check common environment variables
  const environment = getTrimmedEnvVar("ENVIRONMENT");
  if (environment) {
    return environment;
  }

  const env = getTrimmedEnvVar("ENV");
  if (env) {
    return env;
  }

  // Hostname detection (e.g., 'web-prod-01')
  const hostname = getTrimmedEnvVar("HOSTNAME");
  if (hostname && hostname.includes("prod")) {
    return "production";
  }

  // User detection (Root usually means prod)
  const user = getTrimmedEnvVar("USER");
  if (user === "root") {
    return "production";
  }

  // Default to development when no explicit environment is set
  return "development";
}

function getEnvironmentFiles(env) {
  return {
    envFiles: [`.env.${env}.local`, `.env.${env}`, ".env.local", ".env"],
    jsonFiles: [`config.${env}.json`, "config.json"],
    yamlFiles: [
      `config.${env}.yaml`,
      `config.${env}.yml`,
      "config.yaml",
      "config.yml",
    ],
  };
}

/**
 * Loads configuration for a given runtime environment by combining
 * environment-specific file paths with any user-provided options
 * and delegating to {@link loadConfig}.
 *
 * When no environment is explicitly provided, the environment is
 * inferred from standard process environment variables via
 * {@link detectEnvironment}.
 *
 * @param {string} [env=detectEnvironment()] - Name of the environment
 * (for example, "development", "production", or "test"). If omitted,
 * the environment is auto-detected.
 * @param {Object} [options={}] - Optional overrides that are merged
 * into the default loader options (such as file paths and priority)
 * before being passed to {@link loadConfig}.
 * @returns {Object} The resolved configuration object returned by
 * {@link loadConfig} after loading and merging all applicable sources.
 */
function loadEnvironmentConfig(env = detectEnvironment(), options = {}) {
  const envFiles = getEnvironmentFiles(env);

  const mergedOptions = {
    envPath: envFiles.envFiles,
    jsonPaths: envFiles.jsonFiles,
    yamlPaths: envFiles.yamlFiles,
    priority: ["env", "yaml", "json"],
    ...options,
  };

  return loadConfig(mergedOptions);
}

/**
 * Determines whether the current runtime environment is production-like.
 *
 * This function returns `true` when {@link detectEnvironment}
 * resolves to either:
 *  - `"production"`
 *  - `"prod"`
 *
 * @returns {boolean} `true` if the environment is one of
 *          "production" or "prod"; otherwise `false`.
 */
function isProduction() {
  const env = detectEnvironment();
  return env === "production" || env === "prod";
}

/**
 * Determines whether the current runtime environment is development-like.
 *
 * This function returns `true` when {@link detectEnvironment}
 * resolves to either:
 *  - `"development"`
 *  - `"dev"`
 *
 * @returns {boolean} `true` if the environment is one of
 *          "development" or "dev"; otherwise `false`.
 */
function isDevelopment() {
  const env = detectEnvironment();
  return env === "development" || env === "dev";
}

/**
 * Determines whether the current runtime environment is test-like.
 *
 * This function returns `true` when {@link detectEnvironment}
 * resolves to either:
 *  - `"test"`
 *  - `"testing"`
 *
 * @returns {boolean} `true` if the environment is one of
 *          "test" or "testing"; otherwise `false`.
 */
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
