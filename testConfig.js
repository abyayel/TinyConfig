const { loadConfig } = require("./src/index");

const config = loadConfig();
console.log("Merged Configuration:");
console.log(JSON.stringify(config, null, 2));
