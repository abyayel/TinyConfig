const fs = require("fs");
const path = require("path");
const toml = require("toml");

function loadToml(filePaths = "config.toml") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`TOML config file not found: ${filePath}`);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = toml.parse(data);
      // Merge configs
      Object.keys(config).forEach((key) => {
        if (
          typeof config[key] === "object" &&
          config[key] !== null &&
          typeof mergedConfig[key] === "object" &&
          mergedConfig[key] !== null
        ) {
          // Deep merge for nested objects
          mergedConfig[key] = { ...mergedConfig[key], ...config[key] };
        } else {
          mergedConfig[key] = config[key];
        }
      });
    } catch (error) {
      console.error(`Error loading TOML file ${filePath}:`, error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadToml };
