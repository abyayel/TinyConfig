const fs = require("fs");
const path = require("path");

function loadJson(filePaths = "config.json") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      try {
        const data = fs.readFileSync(absolutePath, "utf8");
        const config = JSON.parse(data);
        mergedConfig = { ...mergedConfig, ...config };
      } catch (error) {
        console.warn(`Failed to load JSON file ${filePath}:`, error.message);
      }
    }
  });

  return mergedConfig;
}

module.exports = { loadJson };
