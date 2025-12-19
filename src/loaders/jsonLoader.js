const fs = require("fs");
const path = require("path");

/**
 * Load configuration from JSON file(s)
 * @param {string|string[]} filePaths - Path(s) to JSON file(s)
 * @returns {Object} Merged configuration from all JSON files
 */
function loadJson(filePaths = "config.json") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`JSON config file not found: ${filePath}`);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = JSON.parse(data);
      // Simple merge (for now - deep merge happens later)
      mergedConfig = { ...mergedConfig, ...config };
    } catch (error) {
      console.error(`Error loading JSON file ${filePath}:`, error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadJson };
