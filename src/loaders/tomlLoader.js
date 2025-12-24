const fs = require("fs");
const path = require("path");

function loadToml(filePaths = "config.toml") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn("TOML config file not found:", filePath);
      return;
    }

    try {
      // TOML parsing would require 'toml' package
      // const toml = require('toml');
      // const data = fs.readFileSync(absolutePath, 'utf8');
      // const config = toml.parse(data);
      // mergedConfig = { ...mergedConfig, ...config };

      console.log(
        'TOML support: Install "toml" package to enable parsing for',
        filePath
      );
      // Return empty object for now, but structure is ready
    } catch (error) {
      console.error("Error with TOML file", filePath, ":", error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadToml };
