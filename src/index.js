const { loadEnv } = require("./loaders/envLoader");
const { loadJson } = require("./loaders/jsonLoader");
const { loadYaml } = require("./loaders/yamlLoader");
const { loadToml } = require("./loaders/tomlLoader");
const { loadXml } = require("./loaders/xmlLoader");
const { loadIni } = require("./loaders/iniLoader");

const { mergeConfigs } = require("./strategies/advancedMerge");
const { validateWithSchema } = require("./validation/schemaValidator");

function loadConfig(options = {}) {
  const {
    envPath = ".env",
    jsonPaths = "config.json",
    yamlPaths = ["config.yaml", "config.yml"],
    tomlPaths = "config.toml",
    xmlPaths = "config.xml",
    iniPaths = "config.ini",
    priority = ["env", "yaml", "json", "toml", "xml", "ini"],
  } = options;

  const envConfig = loadEnv(envPath);
  const jsonConfig = loadJson(jsonPaths);
  const yamlConfig = loadYaml(yamlPaths);
  const tomlConfig = loadToml(tomlPaths);
  const xmlConfig = loadXml(xmlPaths);
  const iniConfig = loadIni(iniPaths);

  const configsInOrder = [];
  priority.forEach((source) => {
    switch (source) {
      case "env":
        configsInOrder.push(envConfig);
        break;
      case "yaml":
        configsInOrder.push(yamlConfig);
        break;
      case "json":
        configsInOrder.push(jsonConfig);
        break;
      case "toml":
        configsInOrder.push(tomlConfig);
        break;
      case "xml":
        configsInOrder.push(xmlConfig);
        break;
      case "ini":
        configsInOrder.push(iniConfig);
        break;
    }
  });

  let mergedConfig = {};
  configsInOrder.forEach((config) => {
    mergedConfig = mergeConfigs(mergedConfig, config);
  });

  return mergedConfig;
}

module.exports = {
  loadConfig,
  mergeConfigs,
  validateWithSchema,
  loadEnv,
  loadJson,
  loadYaml,
  loadToml,
  loadXml,
  loadIni,
};
