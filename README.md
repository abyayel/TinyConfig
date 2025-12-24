# TinyConfig

A lightweight configuration loader for Node.js that merges settings from `.env`, JSON, and YAML files into a single, unified configuration object.

## 🚀 Why TinyConfig?

Managing configuration across multiple file formats is tedious. TinyConfig gives you one clean API to load and merge settings with customizable priority rules.

### Before TinyConfig:
```javascript
// Manual loading and merging
require('dotenv').config();
const jsonConfig = require('./config.json');
const yaml = require('js-yaml');
const fs = require('fs');
const yamlConfig = yaml.load(fs.readFileSync('config.yaml'));
// Manual merging logic...
```

### After TinyConfig:
```javascript
const { loadConfig } = require('tiny-config');
const config = loadConfig(); // One line!
```

---

## ✨ Features

- **Multi-format Support**: Load configuration from `.env`, `JSON`, and `YAML` files.
- **Priority Merging**: Customizable merge order (default: `.env` > `YAML` > `JSON`).
- **Multiple Files**: Support for multiple configuration files per type.
- **Error Handling**: Graceful handling of missing or invalid files.
- **Simple API**: Clean, minimal interface with sensible defaults.

---

## 📦 Installation

Install via npm:
```bash
npm install tiny-config
```

Or from source:
```bash
git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig
npm install
```

---

## 🚦 Quick Start

### 1. Create configuration files

**`.env`**
```env
API_KEY=my_secret_key_123
DATABASE_URL=mongodb://localhost:27017/mydb
DEBUG=true
```

**`config.json`**
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

**`config.yaml`**
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

### 2. Use in your app

```javascript
const { loadConfig } = require('tiny-config');

// Load with default settings
const config = loadConfig();

console.log(config.API_KEY);          // "my_secret_key_123" (from .env)
console.log(config.server.port);      // 8080 (from YAML, overrides JSON)
console.log(config.features.cache);   // false (from YAML, overrides JSON)
console.log(config.features.logging); // false (from JSON)
console.log(config.database.timeout); // 5000 (from YAML)
```

---

## 🛠 API Reference

### `loadConfig(options)` / `tinyConfig(options)`
Loads and merges configuration from multiple sources.

**Parameters:**
- `options.envPath` (String|Array): Path(s) to `.env` file(s) (default: `'.env'`)
- `options.jsonPaths` (String|Array): Path(s) to JSON file(s) (default: `'config.json'`)
- `options.yamlPaths` (String|Array): Path(s) to YAML file(s) (default: `['config.yaml', 'config.yml']`)
- `options.priority` (Array): Merge priority order (default: `['env', 'yaml', 'json']`)

**Returns:** Merged configuration object.

**Example:**
```javascript
const config = loadConfig({
  envPath: ['.env.local', '.env'],
  jsonPaths: ['config.default.json', 'config.override.json'],
  yamlPaths: 'config.production.yaml',
  priority: ['env', 'json', 'yaml'] // Custom priority
});
```

### Environment-Specific Config
TinyConfig includes built-in support for environment-specific configuration loading and detection.

#### `detectEnvironment(options)`
Detects the environment based on `NODE_ENV`, `ENVIRONMENT`, or `ENV`.
- **Caching**: The result is cached for the life of the process.
- **Aliases**: Normalizes `prod` -> `production`, `dev` -> `development`, `testing` -> `test`.
- **Options**: `{ refresh: true }` to bypass cache.

#### `loadEnvironmentConfig(env)`
Loads files with environment suffixes (e.g., `config.production.json`).
- If `env` is not provided, it auto-detects using `detectEnvironment()`.

#### Helper Functions
- `isProduction()`: Returns true if environment is production.
- `isDevelopment()`: Returns true if environment is development.
- `isTesting()`: Returns true if environment is test.
- `clearCache()`: Resets the environment cache (useful for testing).

---

## ⚖️ Priority System

Configuration sources are merged with the following priority (highest to lowest):
1. **.env files** (Environment variables)
2. **YAML files** (`config.yaml`, `config.yml`)
3. **JSON files** (`config.json`)

*Note: Within each type, files are processed in order (the last file in an array overrides previous ones).*

---

## 📖 Examples

See the `examples/` directory for more usage patterns:
- `basic-usage.js`: Basic configuration loading.
- `environment-demo.js`: Environment detection and loading demo.

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏅 Acknowledgments

- Built with **Node.js**
- Uses [**dotenv**](https://github.com/motdotla/dotenv) for `.env` file parsing
- Uses [**js-yaml**](https://github.com/nodeca/js-yaml) for YAML parsing

---

## 🗺 Roadmap

- [x] Environment-specific configuration loading
- [x] Docker and containerization examples
- [x] CLI tool for configuration management
- [ ] TypeScript type definitions
- [ ] Support for TOML, XML, and INI files
- [ ] Configuration validation with JSON Schema
