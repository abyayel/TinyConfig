let cachedEnv = null;

/**
 * Trims a process environment variable value.
 * @param {string} name - The name of the environment variable.
 * @returns {string} The trimmed value or an empty string.
 */
function getTrimmedEnvVar(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

const STANDARD_ENVIRONMENTS = ["production", "development", "test", "staging"];

/**
 * Detect the current runtime environment by checking common environment variables.
 *
 * The detection follows this priority:
 * 1. NODE_ENV
 * 2. ENVIRONMENT
 * 3. ENV
 *
 * If none are set, it defaults to 'development'. The result is cached for performance.
 *
 * @param {Object} [options={}] - Options for detection.
 * @param {boolean} [options.refresh=false] - If true, bypasses the cache and re-detects the environment.
 * @returns {string} The detected environment string (e.g., 'production', 'development', 'test', 'staging').
 */
function detectEnvironment(options = {}) {
  if (cachedEnv && !options.refresh) return cachedEnv;

  // 1. Explicit override (Standard variables)
  let env =
    getTrimmedEnvVar("NODE_ENV") ||
    getTrimmedEnvVar("ENVIRONMENT") ||
    getTrimmedEnvVar("ENV");

  // 2. Default to development if no variables are set or if empty
  if (!env) {
    env = "development";
  }

  // 3. Normalize aliases
  const lowerEnv = env.toLowerCase();
  let detected;

  if (lowerEnv === "prod" || lowerEnv === "production") {
    detected = "production";
  } else if (lowerEnv === "dev" || lowerEnv === "development") {
    detected = "development";
  } else if (lowerEnv === "test" || lowerEnv === "testing") {
    detected = "test";
  } else {
    detected = lowerEnv;
  }

  // 4. Validation & Warnings (DX Improvement)
  if (!STANDARD_ENVIRONMENTS.includes(detected)) {
    if (detected === "null" || detected === "undefined") {
      console.warn(
        `[TinyConfig] Detected suspicious environment string: "${detected}". This usually happens when an environment variable is set to a JavaScript null/undefined value in code.`
      );
    } else {
      console.warn(
        `[TinyConfig] Non-standard environment detected: "${detected}". Ensure this matches your intended configuration naming convention.`
      );
    }
  }

  cachedEnv = detected;
  return cachedEnv;
}

/**
 * Clears the environment detection cache.
 * Useful for unit testing scenarios where process.env is changed multiple times within the same process.
 */
function clearCache() {
  cachedEnv = null;
}

/**
 * Determines whether the current runtime environment is production-like.
 * @returns {boolean} `true` if the environment is "production"; otherwise `false`.
 */
function isProduction() {
  return detectEnvironment() === "production";
}

/**
 * Determines whether the current runtime environment is development-like.
 * @returns {boolean} `true` if the environment is "development"; otherwise `false`.
 */
function isDevelopment() {
  return detectEnvironment() === "development";
}

/**
 * Determines whether the current runtime environment is test-like.
 * @returns {boolean} `true` if the environment is "test"; otherwise `false`.
 */
function isTesting() {
  return detectEnvironment() === "test";
}

module.exports = {
  detectEnvironment,
  clearCache,
  isProduction,
  isDevelopment,
  isTesting,
};
