function validateWithSchema(config, schema) {
  const errors = [];

  function validateNode(value, rules, path = "") {
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${path} is required`);
      return;
    }

    if (value === undefined || value === null) {
      if (rules.default !== undefined) {
        return rules.default;
      }
      return value;
    }

    if (rules.type) {
      const type = rules.type;
      const actualType = Array.isArray(value) ? "array" : typeof value;

      if (type === "array" && !Array.isArray(value)) {
        errors.push(`${path} should be an array, got ${actualType}`);
      } else if (type !== "array" && actualType !== type) {
        errors.push(`${path} should be ${type}, got ${actualType}`);
      }
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${path} must be one of: ${rules.enum.join(", ")}`);
    }

    if (
      rules.min !== undefined &&
      typeof value === "number" &&
      value < rules.min
    ) {
      errors.push(`${path} must be at least ${rules.min}, got ${value}`);
    }

    if (
      rules.max !== undefined &&
      typeof value === "number" &&
      value > rules.max
    ) {
      errors.push(`${path} must be at most ${rules.max}, got ${value}`);
    }

    if (
      rules.pattern &&
      typeof value === "string" &&
      !rules.pattern.test(value)
    ) {
      errors.push(`${path} must match pattern ${rules.pattern}`);
    }

    if (rules.validate && typeof rules.validate === "function") {
      const validationResult = rules.validate(value);
      if (validationResult !== true) {
        errors.push(`${path}: ${validationResult || "validation failed"}`);
      }
    }

    return value;
  }

  function processSchema(currentConfig, currentSchema, currentPath = "") {
    const processed = {};

    for (const [key, rules] of Object.entries(currentSchema)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      const value = currentConfig[key];

      if (rules.type === "object" && rules.properties) {
        processed[key] = processSchema(value || {}, rules.properties, fullPath);
      } else {
        const validatedValue = validateNode(value, rules, fullPath);
        if (validatedValue !== undefined) {
          processed[key] = validatedValue;
        }
      }
    }

    return processed;
  }

  const validated = processSchema(config, schema);

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
  }

  return validated;
}

function createSchema(rules) {
  return rules;
}

module.exports = { validateWithSchema, createSchema };
