const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Load environment variables from a .env file
 * @param {string|string[]} filePaths - Path(s) to .env file(s)
 * @returns {Object} Environment variables as key-value pairs
 */
function loadEnv(filePaths = ".env") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let allEnvVars = {};

  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (fs.existsSync(absolutePath)) {
      // Load this specific .env file
      require("dotenv").config({ path: absolutePath });
    }
  });

  // Copy all environment variables to our object
  // Filter to avoid system vars if you want (optional)
  Object.keys(process.env).forEach((key) => {
    allEnvVars[key] = process.env[key];
  });

  return allEnvVars;
}

module.exports = { loadEnv };
