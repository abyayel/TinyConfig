const fs = require("fs");
const path = require("path");

function parseIniContent(content) {
  const config = {};
  const lines = content.split("\n");
  let currentSection = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith(";") || line.startsWith("#")) {
      return;
    }

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (!config[currentSection]) {
        config[currentSection] = {};
      }
      return;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex !== -1) {
      const key = line.substring(0, equalsIndex).trim();
      let value = line.substring(equalsIndex + 1).trim();

      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      // FIX: Store in correct location
      if (currentSection) {
        config[currentSection] = config[currentSection] || {};
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
    if (fs.existsSync(absolutePath)) {
      try {
        const data = fs.readFileSync(absolutePath, "utf8");
        const config = parseIniContent(data);
        // FIX: Proper merging for INI sections
        Object.keys(config).forEach((key) => {
          if (typeof config[key] === "object" && !Array.isArray(config[key])) {
            mergedConfig[key] = {
              ...(mergedConfig[key] || {}),
              ...config[key],
            };
          } else {
            mergedConfig[key] = config[key];
          }
        });
      } catch (error) {
        console.warn(
          `Warning: Failed to load INI file ${filePath}:`,
          error.message
        );
      }
    }
  });

  return mergedConfig;
}

module.exports = { loadIni, parseIniContent };
