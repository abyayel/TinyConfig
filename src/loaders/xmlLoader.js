const fs = require("fs");
const path = require("path");

function loadXml(filePaths = "config.xml") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn("XML config file not found:", filePath);
      return;
    }

    try {
      // XML parsing would require 'xml2js' or similar
      console.debug(
        'XML support: Install "xml2js" package to enable parsing for',
        filePath
      );
      // Placeholder for actual implementation
    } catch (error) {
      console.error("Error with XML file", filePath, ":", error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadXml };
