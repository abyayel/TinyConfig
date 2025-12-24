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
    if (line.startsWith("[") && line.endsWith("]")) {
      currentSection = line.substring(1, line.length - 1);
      config[currentSection] = {};
      return;
    }

    // Handle key=value pairs
    const equalsIndex = line.indexOf("=");
    if (equalsIndex !== -1) {
      const key = line.substring(0, equalsIndex).trim();
      let value = line.substring(equalsIndex + 1).trim();

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      // Convert boolean strings
      if (value.toLowerCase() === "true") value = true;
      if (value.toLowerCase() === "false") value = false;

      // Convert number strings
      if (!isNaN(value) && value.trim() !== "") {
        value = Number(value);
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
      console.warn("INI config file not found:", filePath);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = parseIniContent(data);
      mergedConfig = { ...mergedConfig, ...config };
    } catch (error) {
      console.error("Error with INI file", filePath, ":", error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadIni, parseIniContent };
