const fs = require("fs");
const path = require("path");

function parseIniContent(content) {
  const config = {};
  const lines = content.split("\n");
  let currentSection = null;

  lines.forEach((line) => {
    line = line.trim();

    // Skip comments and empty lines
    if (!line || line.startsWith(";") || line.startsWith("#")) {
      return;
    }

    // Handle sections [section]
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (!config[currentSection]) {
        config[currentSection] = {};
      }
      return;
    }

    // Handle key=value pairs
    const equalsIndex = line.indexOf("=");
    if (equalsIndex !== -1) {
      const key = line.substring(0, equalsIndex).trim();
      let value = line.substring(equalsIndex + 1).trim();

      // Remove surrounding quotes while preserving inner quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      // Try to parse as number
      if (!isNaN(value) && value.trim() !== "" && !value.includes(".")) {
        value = parseInt(value, 10);
      } else if (!isNaN(value) && value.includes(".")) {
        value = parseFloat(value);
      }
      // Try to parse as boolean
      else if (value.toLowerCase() === "true") {
        value = true;
      } else if (value.toLowerCase() === "false") {
        value = false;
      }
      // Try to parse as null/undefined
      else if (value.toLowerCase() === "null") {
        value = null;
      } else if (value.toLowerCase() === "undefined") {
        value = undefined;
      }

      if (currentSection) {
        config[currentSection][key] = value;
      } else {
        config[key] = value;
      }
    }
  });

  return config;
}

function loadIni(filePaths = "config.ini") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`INI config file not found: ${filePath}`);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = parseIniContent(data);

      // Merge sections
      Object.keys(config).forEach((section) => {
        if (typeof config[section] === "object") {
          if (!mergedConfig[section]) {
            mergedConfig[section] = {};
          }
          Object.keys(config[section]).forEach((key) => {
            mergedConfig[section][key] = config[section][key];
          });
        } else {
          mergedConfig[section] = config[section];
        }
      });
    } catch (error) {
      console.error(`Error loading INI file ${filePath}:`, error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadIni, parseIniContent };
