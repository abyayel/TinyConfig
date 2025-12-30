const fs = require("fs");
const path = require("path");
const toml = require("toml");

function loadToml(filePaths = "config.toml") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = toml.parse(data);
      mergedConfig = { ...mergedConfig, ...config };
    }
  });

  return mergedConfig;
}

module.exports = { loadToml };
