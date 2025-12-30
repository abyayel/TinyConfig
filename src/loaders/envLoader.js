const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function loadEnv(filePaths = ".env") {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  let allEnvVars = {};

  // FIX: Don't call dotenv.config() at the top level
  // Only load the specific files
  paths.forEach((filePath) => {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(absolutePath)) {
      try {
        const envConfig = dotenv.config({ path: absolutePath });
        if (envConfig.error) {
          console.warn(
            `Warning: Error loading ${filePath}:`,
            envConfig.error.message
          );
        }
      } catch (error) {
        console.warn(
          `Warning: Failed to load env file ${filePath}:`,
          error.message
        );
      }
    }
  });

  // Copy all environment variables
  Object.keys(process.env).forEach((key) => {
    allEnvVars[key] = process.env[key];
  });

  return allEnvVars;
}

module.exports = { loadEnv };
