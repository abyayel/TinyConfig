const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

function flattenXmlObject(obj, prefix = "") {
  const result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(obj[key])) {
        // Handle arrays
        if (obj[key].length === 1 && typeof obj[key][0] === "object") {
          // Single object in array - flatten it
          Object.assign(result, flattenXmlObject(obj[key][0], newKey));
        } else if (typeof obj[key][0] === "string") {
          // Array of strings
          result[newKey] = obj[key];
        } else {
          // Complex array
          result[newKey] = obj[key];
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively flatten nested objects
        Object.assign(result, flattenXmlObject(obj[key], newKey));
      } else {
        // Primitive value
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

function loadXml(filePaths = "config.xml") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let mergedConfig = {};
  const parser = new xml2js.Parser({ explicitArray: false });

  const loadFile = (filePath) => {
    return new Promise((resolve, reject) => {
      const absolutePath = path.resolve(process.cwd(), filePath);

      if (!fs.existsSync(absolutePath)) {
        console.warn(`XML config file not found: ${filePath}`);
        resolve({});
        return;
      }

      fs.readFile(absolutePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading XML file ${filePath}:`, err.message);
          resolve({});
          return;
        }

        parser.parseString(data, (parseErr, result) => {
          if (parseErr) {
            console.error(
              `Error parsing XML file ${filePath}:`,
              parseErr.message
            );
            resolve({});
            return;
          }

          // Flatten the XML structure to a simpler object
          const flattened = flattenXmlObject(result);
          resolve(flattened);
        });
      });
    });
  };

  // Note: This is simplified - for sync compatibility, we'll use sync version
  // In production, consider making loadConfig async
  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`XML config file not found: ${filePath}`);
      return;
    }

    try {
      const data = fs.readFileSync(absolutePath, "utf8");
      let parsed = {};
      parser.parseString(data, (err, result) => {
        if (err) throw err;
        parsed = flattenXmlObject(result);
      });

      // Merge with existing config
      Object.keys(parsed).forEach((key) => {
        mergedConfig[key] = parsed[key];
      });
    } catch (error) {
      console.error(`Error with XML file ${filePath}:`, error.message);
    }
  });

  return mergedConfig;
}

module.exports = { loadXml, flattenXmlObject };
