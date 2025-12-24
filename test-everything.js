const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("TINYCONFIG COMPREHENSIVE TEST SUITE");
console.log("=======================================\n");

let passed = 0;
let failed = 0;

function runTest(name, testFn) {
  try {
    console.log(`${name}...`);
    testFn();
    console.log(`   PASSED\n`);
    passed++;
  } catch (error) {
    console.log(`   FAILED: ${error.message}\n`);
    failed++;
  }
}

// =================== TEST 1: CORE FUNCTIONALITY ===================
runTest("Test 1: Core loadConfig function", () => {
  const { loadConfig } = require("./src/index");
  const config = loadConfig({
    envPath: ".env.example",
    jsonPaths: "config.json",
    yamlPaths: "config.yaml",
  });

  if (!config.API_KEY) throw new Error("API_KEY not loaded from .env.example");
  if (config.server?.port !== 8080)
    throw new Error("Priority merging failed (YAML should override JSON)");
  if (config.features?.cache !== false)
    throw new Error("Priority merging failed for features.cache");
});

// =================== TEST 2: CLI TOOL ===================
runTest("Test 2: CLI show command", () => {
  const output = execSync("node bin/tiny-config.js show", { encoding: "utf8" });

  // Find where JSON starts (skip any debug messages)
  const lines = output.split("\n");
  let jsonStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("{")) {
      jsonStartIndex = i;
      break;
    }
  }

  if (jsonStartIndex === -1) {
    throw new Error("No JSON found in CLI output");
  }

  const jsonOutput = lines.slice(jsonStartIndex).join("\n");
  const parsed = JSON.parse(jsonOutput);

  if (typeof parsed !== "object") {
    throw new Error("CLI show did not return valid JSON");
  }
});

runTest("Test 3: CLI validate command", () => {
  const output = execSync("node bin/tiny-config.js validate", {
    encoding: "utf8",
  });
  if (!output.includes("Configuration loaded"))
    throw new Error("CLI validate failed");
});

runTest("Test 4: CLI generate-env command", () => {
  execSync("node bin/tiny-config.js generate-env", { encoding: "utf8" });
  if (!fs.existsSync(".env.template"))
    throw new Error(".env.template not created");
});

runTest("Test 5: CLI check command", () => {
  const output = execSync("node bin/tiny-config.js check", {
    encoding: "utf8",
  });
  // This may fail if .env.example is missing, but command should run
  console.log("   Note: check command executed (may show warnings)");
});

// =================== TEST 3: FILE FORMAT SUPPORT ===================
runTest("Test 6: JSON loader", () => {
  const { loadJson } = require("./src/index");
  const config = loadJson("config.json");
  if (!config.server || config.server.port !== 3000)
    throw new Error("JSON loader failed");
});

runTest("Test 7: YAML loader", () => {
  const { loadYaml } = require("./src/index");
  const config = loadYaml("config.yaml");
  if (!config.server || config.server.port !== 8080)
    throw new Error("YAML loader failed");
});

runTest("Test 8: INI loader", () => {
  const { loadIni } = require("./src/index");
  // Create test INI file
  fs.writeFileSync("test.ini", "[database]\nhost=localhost\nport=5432");
  const config = loadIni("test.ini");
  if (config.database?.host !== "localhost")
    throw new Error("INI loader failed");
  fs.unlinkSync("test.ini");
});

// =================== TEST 4: ADVANCED FEATURES ===================
runTest("Test 9: Environment detection", () => {
  const { detectEnvironment } = require("./src/index");
  const env = detectEnvironment();
  if (typeof env !== "string") throw new Error("Environment detection failed");
  console.log(`   Detected environment: ${env}`);
});

runTest("Test 10: Environment config loading", () => {
  const { loadEnvironmentConfig } = require("./src/index");
  const config = loadEnvironmentConfig("development");
  if (typeof config !== "object")
    throw new Error("Environment config loading failed");
});

runTest("Test 11: Schema validation", () => {
  const { validateWithSchema } = require("./src/index");
  const config = { server: { port: 8080 }, API_KEY: "test123" };
  const schema = {
    server: { port: { type: "number", min: 1, max: 65535 } },
    API_KEY: { required: true, type: "string" },
  };
  validateWithSchema(config, schema);
});

runTest("Test 12: Advanced merging strategies", () => {
  const { mergeWithStrategy } = require("./src/index");
  const obj1 = { a: 1, b: { x: 1 } };
  const obj2 = { a: 2, b: { y: 2 } };
  const merged = mergeWithStrategy(obj1, obj2, "shallow-merge");
  if (merged.b.y !== 2) throw new Error("Advanced merging failed");
});

// =================== TEST 5: EXAMPLES ===================
runTest("Test 13: Basic example works", () => {
  const output = execSync("node examples/basic-usage.js", { encoding: "utf8" });
  if (!output.includes("TinyConfig Demo"))
    throw new Error("Basic example failed");
  if (!output.includes("Server Port: 8080"))
    throw new Error("Basic example shows wrong priority");
});

runTest("Test 14: Express example file exists", () => {
  if (!fs.existsSync("examples/express-server.js"))
    throw new Error("Express example missing");
  const content = fs.readFileSync("examples/express-server.js", "utf8");
  if (!content.includes("loadEnvironmentConfig"))
    throw new Error("Express example not using TinyConfig");
});

// =================== TEST 6: TYPE SAFETY ===================
runTest("Test 15: TypeScript definitions exist", () => {
  if (!fs.existsSync("types/index.d.ts"))
    throw new Error("TypeScript definitions missing");
  const content = fs.readFileSync("types/index.d.ts", "utf8");
  if (!content.includes("declare module"))
    throw new Error("Invalid TypeScript definitions");
});

// =================== TEST 7: PROJECT STRUCTURE ===================
runTest("Test 16: Required files exist", () => {
  const requiredFiles = [
    "package.json",
    "README.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "LICENSE",
    "src/index.js",
    "src/loaders/envLoader.js",
    "src/loaders/jsonLoader.js",
    "src/loaders/yamlLoader.js",
    "bin/tiny-config.js",
  ];

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) throw new Error(`Required file missing: ${file}`);
  });
});

// =================== TEST 8: NPM PACKAGE READY ===================
runTest("Test 17: Package.json valid", () => {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  if (!pkg.name || !pkg.version || !pkg.main || !pkg.bin) {
    throw new Error("Package.json missing required fields");
  }
  if (pkg.name !== "tiny-config") throw new Error("Package name incorrect");
});

// =================== TEST 9: ERROR HANDLING ===================
runTest("Test 18: Graceful error handling", () => {
  const { loadJson } = require("./src/index");
  const config = loadJson("non-existent-file.json");
  // Should return empty object, not crash
  if (typeof config !== "object") throw new Error("Error handling failed");
});

// =================== TEST 10: CONFIGURATION FILES ===================
runTest("Test 19: Configuration files exist", () => {
  const configFiles = [
    ".env.example",
    "config.json",
    "config.yaml",
    "config.ini",
    "config.toml",
    "config.xml",
  ];

  configFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      console.log(`   Warning: ${file} missing (optional)`);
    }
  });
});

// =================== FINAL SUMMARY ===================
console.log("=======================================");
console.log("TEST RESULTS SUMMARY");
console.log("=======================================");
console.log(`Total Tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
  console.log("\nCONGRATULATIONS! ALL TESTS PASSED!");
  console.log("TinyConfig is ready for production!");
} else {
  console.log(`\n${failed} test(s) failed. Review the errors above.`);
}

// Cleanup
if (fs.existsSync(".env.template")) {
  fs.unlinkSync(".env.template");
}
