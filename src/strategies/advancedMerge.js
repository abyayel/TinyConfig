function mergeWithStrategy(target, source, strategy = 'override') {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      switch(strategy) {
        case 'override':
          result[key] = sourceValue;
          break;
          
        case 'merge-deep':
          if (sourceValue && typeof sourceValue === 'object' && 
              targetValue && typeof targetValue === 'object' &&
              !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
            result[key] = mergeWithStrategy(targetValue, sourceValue, strategy);
          } else {
            result[key] = sourceValue;
          }
          break;
          
        case 'shallow-merge':
          if (sourceValue && typeof sourceValue === 'object' && 
              targetValue && typeof targetValue === 'object') {
            result[key] = { ...targetValue, ...sourceValue };
          } else {
            result[key] = sourceValue;
          }
          break;
          
        case 'concat-arrays':
          if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
            result[key] = targetValue.concat(sourceValue);
          } else if (Array.isArray(sourceValue)) {
            result[key] = sourceValue;
          } else if (Array.isArray(targetValue)) {
            result[key] = targetValue;
          } else {
            result[key] = sourceValue;
          }
          break;
          
        case 'prepend-arrays':
          if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
            result[key] = sourceValue.concat(targetValue);
          } else if (Array.isArray(sourceValue)) {
            result[key] = sourceValue;
          } else if (Array.isArray(targetValue)) {
            result[key] = targetValue;
          } else {
            result[key] = sourceValue;
          }
          break;
          
        default:
          result[key] = sourceValue;
      }
    }
  }
  
  return result;
}

function mergeWithPriorityMap(configs, priorityMap = {}) {
  let merged = {};
  const defaultPriority = ['env', 'yaml', 'json', 'toml', 'xml', 'ini'];
  
  for (const source of defaultPriority) {
    if (configs[source]) {
      merged = mergeWithStrategy(merged, configs[source], 'override');
    }
  }
  
  return merged;
}

function transformValues(config, transformers = {}) {
  const result = { ...config };
  
  for (const [key, transformer] of Object.entries(transformers)) {
    if (key in result) {
      if (typeof transformer === 'function') {
        result[key] = transformer(result[key]);
      }
    }
  }
  
  return result;
}

module.exports = { 
  mergeWithStrategy, 
  mergeWithPriorityMap, 
  transformValues 
};