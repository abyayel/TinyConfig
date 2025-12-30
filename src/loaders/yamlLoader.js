const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadYaml(filePaths = ["config.yaml", "config.yml"]) {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      const data = fs.readFileSync(absolutePath, "utf8");
      const config = yaml.load(data);
      mergedConfig = { ...mergedConfig, ...config };
    }
  });

  return mergedConfig;
}

module.exports = { loadYaml };
