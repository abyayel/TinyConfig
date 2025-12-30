function mergeConfigs(target, source) {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (Array.isArray(sourceValue)) {
      result[key] = [
        ...(Array.isArray(targetValue) ? targetValue : []),
        ...sourceValue,
      ];
    } else if (typeof sourceValue === "object" && sourceValue !== null) {
      result[key] = mergeConfigs(targetValue || {}, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  }

  return result;
}

module.exports = { mergeConfigs };
