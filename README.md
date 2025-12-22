# TinyConfig

A lightweight configuration loader for Node.js that merges settings from `.env`, JSON, and YAML files into a single, unified configuration object.

## Why TinyConfig?

Managing configuration across multiple file formats is tedious. TinyConfig gives you one clean API to load and merge settings with customizable priority rules.

### Before TinyConfig:
// Manual loading and merging
require('dotenv').config();
const jsonConfig = require('./config.json');
const yaml = require('js-yaml');
const fs = require('fs');
const yamlConfig = yaml.load(fs.readFileSync('config.yaml'));
// Manual merging logic...

After TinyConfig:
javascript
const { loadConfig } = require('tiny-config');
const config = loadConfig(); // One line!

Features

Multi-format Support: Load configuration from .env, JSON, and YAML files
Priority Merging: Customizable merge order (default: .env > YAML > JSON)
Multiple Files: Support for multiple configuration files per type
Error Handling: Graceful handling of missing or invalid files
Simple API: Clean, minimal interface with sensible defaults

Installation
bash
npm install tiny-config
Or from source:

git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig
npm install

Quick Start
Create configuration files:

.env
API_KEY=my_secret_key_123
DATABASE_URL=mongodb://localhost:27017/mydb
DEBUG=true

config.json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "features": {
    "cache": true,
    "logging": false
  }
}

config.yaml
server:
  port: 8080
  name: "TinyConfig Server"

database:
  connectionPool: 10
  timeout: 5000

features:
  cache: false
  analytics: true
  
Use in your app:

const { loadConfig } = require('tiny-config');

// Load with default settings
const config = loadConfig();

console.log(config.API_KEY); // "my_secret_key_123" (from .env)
console.log(config.server.port); // 8080 (from YAML, overrides JSON)
console.log(config.features.cache); // false (from YAML, overrides JSON)
console.log(config.features.logging); // false (from JSON)
console.log(config.database.timeout); // 5000 (from YAML)


API Reference

loadConfig(options)
Load and merge configuration from multiple sources.

Parameters:
options.envPath (String|Array): Path(s) to .env file(s) (default: '.env')
options.jsonPaths (String|Array): Path(s) to JSON file(s) (default: 'config.json')
options.yamlPaths (String|Array): Path(s) to YAML file(s) (default: ['config.yaml', 'config.yml'])
options.priority (Array): Merge priority order (default: ['env', 'yaml', 'json'])

Returns: Merged configuration object

Example:

javascript
const config = loadConfig({
  envPath: ['.env.local', '.env'],
  jsonPaths: ['config.default.json', 'config.override.json'],
  yamlPaths: 'config.production.yaml',
  priority: ['env', 'json', 'yaml'] // Custom priority
});


tinyConfig(options)
Alias for loadConfig(options).

Priority System
Configuration sources are merged with the following priority (highest to lowest):

.env files (Environment variables)
YAML files (config.yaml, config.yml
JSON files (config.json)

Within each type, files are processed in order (last file overrides previous ones).

Examples
See the examples/ directory for more usage patterns:

basic-usage.js - Basic configuration loading
More examples coming soon!


Project Structure
tiny-config/
├── src/
│   ├── loaders/          # File format loaders
│   │   ├── envLoader.js
│   │   ├── jsonLoader.js
│   │   └── yamlLoader.js
│   ├── mergeStrategies.js # Merging logic
│   └── index.js          # Main export
├── examples/             # Usage examples
├── tests/               # Test files
└── package.json


Running Tests

npm test


Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Code of Conduct
Please read our Code of Conduct before contributing.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Built with Node.js
Uses dotenv for .env file parsing
Uses js-yaml for YAML parsing

Roadmap
CLI tool for configuration management
TypeScript type definitions
Support for TOML, XML, and INI files
Configuration validation with JSON Schema
Environment-specific configuration loading
Docker and containerization examples
