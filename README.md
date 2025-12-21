# TinyConfig

A lightweight, multi-format configuration loader for Node.js.

## Features
- **Multi-format**: Loads `.env`, `JSON`, and `YAML` files.
- **Environment Aware**: Automatically detects `production`, `development`, etc.
- **Smart Merging**: Overrides configs with priority (Env Vars > YAML > JSON).

## Installation
```bash
npm install tiny-config
```

## Quick Start
```javascript
const { loadConfig } = require('tiny-config');
const config = loadConfig();
console.log(config.server.port);
```

## Environment Support
TinyConfig now supports environment-based overrides.

### 1. File Structure
```
.env                # Default secrets
.env.production     # Production override
config.json         # Default settings
config.production.json # Production settings
```

### 2. Usage
```javascript
const { loadEnvironmentConfig } = require('tiny-config');

// Automatically detects NODE_ENV or ENVIRONMENT variable
const config = loadEnvironmentConfig();
```

### 3. Docker Support
See `docker/tiny-config-example/` for a production-ready Dockerfile example.
