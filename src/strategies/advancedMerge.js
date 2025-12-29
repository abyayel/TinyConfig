function mergeWithStrategy(target, source, strategy = "merge-deep") {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      // Special handling for arrays
      if (Array.isArray(sourceValue)) {
        switch (strategy) {
          case "concat-arrays":
            result[key] = Array.isArray(targetValue)
              ? [...targetValue, ...sourceValue]
              : [...sourceValue];
            break;
          case "prepend-arrays":
            result[key] = Array.isArray(targetValue)
              ? [...sourceValue, ...targetValue]
              : [...sourceValue];
            break;
          case "unique-arrays":
            const combined = Array.isArray(targetValue)
              ? [...targetValue, ...sourceValue]
              : [...sourceValue];
            result[key] = [...new Set(combined)];
            break;
          case "merge-deep":
            // For arrays with deep merge, we need special handling
            if (
              Array.isArray(targetValue) &&
              sourceValue.length > 0 &&
              typeof sourceValue[0] === "object" &&
              sourceValue[0] !== null
            ) {
              // Merge array of objects by index
              const mergedArray = [...targetValue];
              sourceValue.forEach((item, index) => {
                if (
                  mergedArray[index] &&
                  typeof item === "object" &&
                  item !== null
                ) {
                  mergedArray[index] = mergeWithStrategy(
                    mergedArray[index],
                    item,
                    strategy
                  );
                } else {
                  mergedArray[index] = item;
                }
              });
              result[key] = mergedArray;
            } else {
              result[key] = sourceValue; // Default override for arrays
            }
            break;
          default:
            result[key] = sourceValue; // override
        }
      }
      // Deep merge for objects
      else if (
        strategy === "merge-deep" &&
        sourceValue &&
        typeof sourceValue === "object" &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        result[key] = mergeWithStrategy(targetValue, sourceValue, strategy);
      }
      // Shallow merge for objects
      else if (
        strategy === "shallow-merge" &&
        sourceValue &&
        typeof sourceValue === "object" &&
        targetValue &&
        typeof targetValue === "object"
      ) {
        result[key] = { ...targetValue, ...sourceValue };
      }
      // Default override
      else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function mergeWithPriorityMap(configs, priorityMap = {}) {
  let merged = {};
  const defaultPriority = ["env", "yaml", "json", "toml", "xml", "ini"];

  for (const source of defaultPriority) {
    if (configs[source]) {
      merged = mergeWithStrategy(merged, configs[source], "merge-deep");
    }
  }

  return merged;
}

function transformValues(config, transformers = {}) {
  const result = { ...config };

  for (const [key, transformer] of Object.entries(transformers)) {
    if (key in result) {
      if (typeof transformer === "function") {
        result[key] = transformer(result[key]);
      }
    }
  }

  return result;
}

// ADDED FUNCTIONS (from old mergeStrategies.js)
function mergeConfigs(configs, priorityOrder = ["env", "yaml", "json"]) {
  let merged = {};

  // Process in priority order: highest priority last
  for (const source of priorityOrder) {
    if (configs[source]) {
      merged = mergeWithStrategy(merged, configs[source], "merge-deep");
    }
  }

  return merged;
}

function deepMerge(target, source) {
  return mergeWithStrategy(target, source, "merge-deep");
}

module.exports = {
  mergeWithStrategy,
  mergeWithPriorityMap,
  transformValues,
  mergeConfigs,
  deepMerge,
};
