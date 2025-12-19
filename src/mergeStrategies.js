/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Deeply merged object
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] instanceof Object &&
        key in result &&
        result[key] instanceof Object &&
        !Array.isArray(source[key]) &&
        !Array.isArray(result[key])
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(result[key], source[key]);
      } else {
        // Overwrite with source value
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * Merge multiple configuration sources with priority
 * @param {Object} configs - Object with config sources
 * @param {string[]} priorityOrder - Order of priority (e.g., ['env', 'yaml', 'json'])
 * @returns {Object} Merged configuration
 */
function mergeConfigs(configs, priorityOrder = ["env", "yaml", "json"]) {
  let merged = {};

  for (const source of priorityOrder) {
    if (configs[source]) {
      merged = deepMerge(configs[source], merged);
    }
  }

  return merged;
}

module.exports = { deepMerge, mergeConfigs };
