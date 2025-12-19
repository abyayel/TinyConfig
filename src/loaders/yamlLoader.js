const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Load configuration from YAML file(s)
 * @param {string|string[]} filePaths - Path(s) to YAML file(s)
 * @returns {Object} Merged configuration from all YAML files
 */
function loadYaml(filePaths = ["config.yaml", "config.yml"]) {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`YAML config file not found: ${filePath}`);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = yaml.load(data);
      // Simple merge (for now - deep merge happens later)
      mergedConfig = { ...mergedConfig, ...config };
    } catch (error) {
      console.error(`Error loading YAML file ${filePath}:`, error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadYaml };
