/**
 * Deep merge two objects (source OVERRIDES target)
 * @param {Object} target - Target object (lower priority)
 * @param {Object} source - Source object (higher priority)
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
        // Source OVERRIDES target (this is correct)
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

  // Process in REVERSE: lowest priority first, highest last
  for (let i = priorityOrder.length - 1; i >= 0; i--) {
    const source = priorityOrder[i];
    if (configs[source]) {
      // merged = target, configs[source] = source
      // source (higher priority) overrides target (accumulated result)
      merged = deepMerge(merged, configs[source]);
    }
  }

  return merged;
}

module.exports = { deepMerge, mergeConfigs };
