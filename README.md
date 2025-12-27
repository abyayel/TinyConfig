# TinyConfig

## GitHub Repository

https://github.com/abyayel/TinyConfig

## What is TinyConfig

A professional configuration management suite for Node.js that merges settings from multiple file formats with smart priority rules, CLI support, and validation.

## Why TinyConfig?

Managing configuration across different file formats is complex and error-prone. TinyConfig simplifies this by providing a unified interface to load, validate, and manage application settings.

### Before TinyConfig

```javascript
// Manual loading and merging
require("dotenv").config();
const jsonConfig = require("./config.json");
const yaml = require("js-yaml");
const fs = require("fs");
const yamlConfig = yaml.load(fs.readFileSync("config.yaml"));
// Manual merging, error handling, priority decisions...
```

### After TinyConfig

```javascript
const { loadConfig } = require("tiny-config");
const config = loadConfig(); // One line!
```

## Features

- **Multi-format Support**: Load from .env, JSON, YAML, TOML, XML, and INI files
- **Command Line Interface**: Full-featured CLI for configuration management
- **Priority Merging**: Customizable merge order (default: .env > YAML > JSON > TOML > XML > INI)
- **Schema Validation**: Type checking and validation with custom rules
- **Environment Detection**: Automatic dev/test/prod environment detection
- **Advanced Merging**: Array concatenation, deep merging, custom strategies
- **TypeScript Ready**: Complete TypeScript definitions included
- **Error Handling**: Graceful handling of missing or invalid files
- **Simple API**: Clean, minimal interface with sensible defaults

## Installation

Since this is an open-source project, install it by cloning the repository:

```bash

# Clone the repository

git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig

# Install required dependencies

npm install

# Optional: Install additional parsers for full format support

# Note: These are only needed if you want TOML or XML support

npm install toml xml2js
```

## Quick Start

### 1. Create Configuration Files

Create these configuration files in your project directory:

- `.env.example` (Template for environment variables - rename to `.env` for actual use)

```env

# Environment Variables Template

# Copy this to .env and fill in your actual values

API_KEY=my_secret_key_123
DATABASE_URL=mongodb://localhost:27017/mydb
DEBUG=true
```

- `config.json` (JSON configuration file for structured settings)

```json
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
```

- `config.yaml` (YAML configuration file - alternative to JSON with cleaner syntax)

```yaml
server:
port: 8080
name: "TinyConfig Server"

database:
connectionPool: 10
timeout: 5000

features:
cache: false
analytics: true
```

### 2. Using Environment Variables

Environment variables in `.env` files are ideal for sensitive data like API keys and database credentials. TinyConfig automatically loads these and merges them with other configuration sources.

### 3. Use TinyConfig in Your Application

```javascript
// Import TinyConfig from the local installation
const { loadConfig } = require("./path/to/TinyConfig/src/index");

// Load with default settings
const config = loadConfig();

console.log(config.API_KEY); // "my_secret_key_123" (from .env)
console.log(config.server.port); // 8080 (from YAML, overrides JSON)
console.log(config.features.cache); // false (from YAML, overrides JSON)
console.log(config.features.logging); // false (from JSON)
console.log(config.database.timeout); // 5000 (from YAML)
```

## Command Line Interface

TinyConfig includes a powerful CLI for configuration management. Run these commands from your terminal in the project directory:

```bash

# Navigate to the project directory

cd TinyConfig

# Show merged configuration (outputs JSON)

node bin/tiny-config.js show

# Validate configuration files

node bin/tiny-config.js validate

# Create .env template file

node bin/tiny-config.js generate-env

# Check for required fields in configuration

node bin/tiny-config.js check
```

## API Reference

### Core Functions

#### `loadConfig(options)`

Load and merge configuration from multiple sources.

**Parameters:**

- `options.envPath (String|Array)`: Path(s) to .env file(s) (default: '.env')
- `options.jsonPaths (String|Array)`: Path(s) to JSON file(s) (default: 'config.json')
- `options.yamlPaths (String|Array)`: Path(s) to YAML file(s) (default: ['config.yaml', 'config.yml'])
- `options.tomlPaths (String|Array)`: Path(s) to TOML file(s) (default: 'config.toml')
- `options.xmlPaths (String|Array)`: Path(s) to XML file(s) (default: 'config.xml')
- `options.iniPaths (String|Array)`: Path(s) to INI file(s) (default: 'config.ini')
- `options.priority (Array)`: Merge priority order (default: ['env', 'yaml', 'json', 'toml', 'xml', 'ini'])
- `options.silent (Boolean)`: Suppress file not found warnings (default: false)

**Returns**: Merged configuration object

**Example:**

```javascript
const config = loadConfig({
  envPath: [".env.local", ".env"],
  jsonPaths: ["config.default.json", "config.override.json"],
  yamlPaths: "config.production.yaml",
  priority: ["env", "json", "yaml"], // Custom priority
});
```

#### `tinyConfig(options)`

Alias for `loadConfig(options)`.

### Validation Functions

#### `validateWithSchema(config, schema)`

Validate configuration against a schema with type checking and rules.

**Schema Example:**

```javascript
const schema = {
  API_KEY: { required: true, type: "string" },
  server: {
    port: { type: "number", min: 1, max: 65535 },
    host: { type: "string", default: "localhost" },
  },
};
```

#### `createSchema(rules)`

Helper function to create validation schemas.

### Environment Functions

- `detectEnvironment()`: Detect current environment (development, test, production).
- `loadEnvironmentConfig(env, options)`: Load environment-specific configuration.
- `isProduction()`, `isDevelopment()`, `isTesting()`: Environment helper functions.

### Advanced Merging Functions

- `mergeWithStrategy(target, source, strategy)`: Merge objects with custom strategy (override, merge-deep, shallow-merge, concat-arrays, prepend-arrays).
- `mergeWithPriorityMap(configs, priorityMap)`: Merge with per-key priority rules.
- `transformValues(config, transformers)`: Transform configuration values with custom functions.

### File Loader Functions

- `loadToml(filePaths)`, `loadXml(filePaths)`, `loadIni(filePaths)`: Individual file format loaders for advanced use.

### Priority System

Configuration sources are merged with the following priority (highest to lowest):

- **.env files** (Environment variables - for secrets and sensitive data)
- **YAML files** (config.yaml, config.yml - human-readable format)
- **JSON files** (config.json - structured configuration)
- **TOML files** (config.toml - simple configuration format)
- **XML files** (config.xml - legacy/enterprise systems)
- **INI files** (config.ini - Windows-style configuration)

Within each type, files are processed in order (last file overrides previous ones).

## Examples

See the [examples/](examples/) directory for comprehensive usage patterns:

- `basic-usage.js` - Basic configuration loading demonstration
- `express-server.js` - Express.js integration example
- `cli-tool-advanced.js` - Advanced CLI usage patterns
- `react-app-example.md` - React application integration guide

## Running Tests

```bash

# Run all tests

npm test

# Run comprehensive integration test

node test-everything.js
```

## File Format Support Details

**Supported Formats:**

- `.env`: Environment variables (via dotenv package) - Ideal for sensitive data
- `JSON`: Standard JSON files - Structured configuration format
- `YAML`: YAML files (via js-yaml package) - Human-readable alternative to JSON
- `TOML`: Requires toml package (optional) - Simple configuration format
- `XML`: Requires xml2js package (optional) - For legacy system integration
- `INI`: Built-in parser (no dependencies) - Windows-style configuration files

**Installation for Full Support:**

```bash

# Note: These packages are optional and only needed if you require TOML or XML support

npm install toml xml2js
```

## Project Structure

```bash
TinyConfig/
├── src/
│ ├── loaders/ # File format loaders (.env, JSON, YAML, TOML, XML, INI)
│ ├── strategies/ # Merging strategies and priority logic
│ ├── validation/ # Schema validation system
│ ├── environments/ # Environment detection and loading
│ └── index.js # Main entry point and API
├── bin/
│ └── tiny-config.js # Command Line Interface tool
├── types/
│ └── index.d.ts # TypeScript definitions for IDE support
├── examples/ # Usage examples and integration patterns
├── tests/ # Test files and validation suite
└── config files # Example configuration files
```

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` file for detailed guidelines on how to contribute to this project.

**Contribution Process:**

- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

**Development Guidelines:**

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## Code of Conduct

Please read our `CODE_OF_CONDUCT.md` before participating in this project. We are committed to providing a welcoming and inclusive environment for all contributors.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

**Key Points:**

- Permission is granted for commercial use, modification, distribution, and private use
- The software is provided "as is" without warranty
- License and copyright notices must be preserved

## Team

This project was developed collaboratively by:

- [Abyayel Abebaye] - Project Lead, CLI & TypeScript implementation
- [Aelaf Tsegaye] - File Format Extensions (TOML, XML, INI loaders)
- [Firaol Tesfaye] - Advanced Merging Strategies and algorithms
- [Alen Wondwosen] - Configuration Validation System
- [Abele Maru] - Environment & Deployment Support
- [Abraham Adugna] - Integration Examples and documentation

## Acknowledgments

- Built with Node.js - JavaScript runtime environment
- Uses dotenv for .env file parsing and environment variable management
- Uses js-yaml for YAML file parsing with safety features
- TOML support via toml package (optional dependency)
- XML support via xml2js package (optional dependency)
- Inspired by the need for simplified configuration management in modern Node.js applications
