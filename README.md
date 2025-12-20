# TinyConfig

TinyConfig loads your app settings from .env, JSON, and YAML files and merges them into one object.

## Installation

```bash
git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig
npm install
```

## Quick Start

```javascript
const { loadConfig } = require('./src/index');

const config = loadConfig({
  envPath: '.env.example',
  jsonPaths: 'config.json',
  yamlPaths: 'config.yaml'
});

console.log('API Key:', config.API_KEY);
console.log('Server Port:', config.server?.port);
```

## Features

- Loads .env, JSON, and YAML files

- Merges with priority (env > yaml > json)

- Simple to use

## License

MIT License
# TinyConfig

TinyConfig is a lightweight and flexible configuration management library for Node.js applications.  
It allows you to load configuration values from **multiple sources**—`.env`, JSON, and YAML files—and **merge them into a single configuration object** using a clear priority strategy.

TinyConfig is designed to be simple, extensible, and ideal for small to medium-sized projects that need clean configuration handling.

---

## Features

- Load configuration from:
  - Environment files (`.env`)
  - JSON configuration files
  - YAML configuration files
- Merge multiple configuration sources into one object
- Customizable merge priority
- Supports multiple files per configuration type
- Simple API with optional advanced loaders

---

## Installation

```bash
git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig
npm install
