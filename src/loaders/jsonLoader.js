const fs = require("fs");
const path = require("path");

function loadJson(filePaths = "config.json") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = JSON.parse(data);
      mergedConfig = { ...mergedConfig, ...config };
    }
  });

  return mergedConfig;
}

module.exports = { loadJson };
