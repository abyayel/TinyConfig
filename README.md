# TinyConfig

## What is TinyConfig

TinyConfig is a lightweight configuration management library for Node.js applications that unifies settings from multiple file formats into a single configuration object. It supports environment-specific configurations, priority-based merging, and provides a CLI for configuration management.

## Key Features

- **Multi-format Configuration Loading**: Load configuration from .env, JSON, YAML, and INI files
- **Environment Detection**: Automatic environment detection (development, test, production)
- **Priority-Based Merging**: Configurable merge order with .env files taking highest priority
- **Command Line Interface**: Full-featured CLI for configuration inspection and validation
- **File Discovery**: Automatic discovery of environment-specific configuration files
- **Error Handling**: Graceful handling of missing or invalid configuration files
- **Simple API**: Clean, minimal interface with sensible defaults

## Installation

Since TinyConfig is a local project, you can use it directly from your project structure:

```bash

# Clone or copy the TinyConfig folder into your project

# Ensure required dependencies are installed

npm install express cors helmet morgan js-yaml dotenv
```

## Quick Start

### 1. Basic Usage

```javascript
const { loadConfig } = require("./TinyConfig/src/index");

// Load configuration with default paths
const config = loadConfig();

// Access configuration values
console.log(config.NODE_ENV); // Environment from .env
console.log(config.server.port); // Server port from YAML
console.log(config.api.basePath); // API base path from JSON
```

### 2. Express.js Integration

```javascript
const express = require("express");
const { loadConfig } = require("./TinyConfig/src/index");

const config = loadConfig({
  envPath: "config/.env",
  jsonPaths: "config/config.json",
  yamlPaths: "config/config.yaml",
  iniPaths: "config/database.ini",
});

const app = express();
const PORT = config.server?.port || config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});
```

### 3. Configuration Structure

Create these configuration files in your project:

#### config/.env (Environment variables - highest priority):

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
API_KEY=your_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

#### config/config.yaml (YAML configuration - second priority):

```yaml
server:
port: 3000
host: "0.0.0.0"
timeout: 30000

database:
host: "localhost"
port: 5432
name: "demo_db"

logging:
level: "info"
format: "combined"
```

#### config/config.json (JSON configuration - third priority):

```json
{
  "api": {
    "basePath": "/api/v1",
    "version": "1.0.0",
    "docsEnabled": true
  },
  "security": {
    "jwtSecret": "your-jwt-secret-key-change-in-production",
    "jwtExpiry": "24h"
  }
}
```

#### config/database.ini (INI configuration - lowest priority):

```ini
[postgres]
host=localhost
port=5432
database=demo_db
username=postgres

[redis]
host=localhost
port=6379
```

## Command Line Interface

TinyConfig includes a comprehensive CLI for configuration management:

```bash

# Show merged configuration (with system environment variables filtered)

node TinyConfig/bin/tiny-config show

# List all configuration files and their status

node TinyConfig/bin/tiny-config list

# Validate configuration files

node TinyConfig/bin/tiny-config validate

# Check for required configuration fields

node TinyConfig/bin/tiny-config check

# Generate .env template file

node TinyConfig/bin/tiny-config generate-env

# Show configuration for specific environment

node TinyConfig/bin/tiny-config env production
```

## API Reference

### Core Functions

#### loadConfig(options)

Load and merge configuration from multiple file formats.

Options:

- **envPath** (String|Array): Path(s) to .env file(s) (default: "config/.env")
- **jsonPaths** (String|Array): Path(s) to JSON file(s) (default: "config/config.json")
- **yamlPaths** (String|Array): Path(s) to YAML file(s) (default: "config/config.yaml")
- **iniPaths** (String|Array): Path(s) to INI file(s) (default: "config/database.ini")
- **priority** (Array): Merge priority order (default: ["env", "yaml", "json", "ini"])

Returns: Merged configuration object

Example:

```javascript
const config = loadConfig({
  envPath: ["config/.env.local", "config/.env"],
  jsonPaths: ["config/config.production.json", "config/config.json"],
  priority: ["env", "json", "yaml"],
});
```

#### detectEnvironment()

Detect the current environment from environment variables.

Returns: Environment string ("development", "test", "production", or custom)

### File Loaders

Individual file format loaders are available for advanced use cases:

- **loadEnv(filePaths)**: Load environment variables from .env files
- **loadJson(filePaths)**: Load configuration from JSON files
- **loadYaml(filePaths)**: Load configuration from YAML files
- **loadIni(filePaths)**: Load configuration from INI files

Example:

```javascript
const { loadJson, loadYaml } = require("./TinyConfig/src/index");
const jsonConfig = loadJson("config/custom.json");
const yamlConfig = loadYaml("config/custom.yaml");
```

### Priority System

Configuration sources are merged with the following priority (highest to lowest):

- **.env files** - Environment variables (for sensitive data and environment-specific settings)
- **YAML files** - Human-readable configuration format
- **JSON files** - Standard structured configuration format
- **INI files** - Simple key-value configuration format

Within each format type, files are loaded in the order specified, with later files overriding earlier ones.

### Environment-Specific Configuration

TinyConfig automatically looks for environment-specific configuration files:

```bash

# For NODE_ENV=production, TinyConfig will look for:

# - config/.env.production then config/.env

# - config/config.production.yaml then config/config.yaml

# - config/config.production.json then config/config.json

# - config/database.production.ini then config/database.ini

```

### Error Handling

TinyConfig provides graceful error handling:

- Missing files are logged as warnings but don't cause failures
- Invalid file formats are reported with descriptive error messages
- The library falls back to environment variables if configuration loading fails
- Individual file loaders include try-catch blocks to prevent cascading failures

## Project Structure

```bash
TinyConfig/
├── src/
│ ├── index.js # Main entry point and public API
│ ├── environmentLoader.js # Environment detection and loading
│ └── loaders/ # File format loaders
│ ├── envLoader.js # .env file loader
│ ├── jsonLoader.js # JSON file loader
│ ├── yamlLoader.js # YAML file loader
│ └── iniloader.js # INI file loader
├── bin/
│ └── tiny-config # Command Line Interface
└── strategies/ # Configuration merging strategies
```

## Best Practices

- **Store sensitive data in .env files** - These are typically excluded from version control
- **Use YAML for complex nested configurations** - More readable than JSON for deeply nested structures
- **Use JSON for API configurations and structured data** - Good for machine-generated configurations
- **Use INI for simple key-value pairs** - Ideal for database connections and service configurations
- **Always provide environment-specific overrides** - Create .env.production, config.production.yaml, etc.
- **Validate required configuration** - Use the CLI's check command to ensure required fields are present

## Integration Example

```javascript
// server.js - Complete Express.js integration example
const express = require("express");
const { loadConfig } = require("./TinyConfig/src/index");

// Load configuration
const config = loadConfig();

// Configure Express with loaded settings
const app = express();
app.set("port", config.server?.port || 3000);
app.set("env", config.NODE_ENV || "development");

// Middleware configuration based on config
if (config.features?.enableRequestLogging) {
  const morgan = require("morgan");
  app.use(morgan(config.logging?.format || "combined"));
}

// Database connection using config
if (config.database) {
  const pool = require("pg").Pool;
  const db = new pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.postgres?.username,
    password: config.postgres?.password,
  });
}

// Start server
app.listen(app.get("port"), () => {
  console.log(
    `Server running in ${app.get("env")} mode on port ${app.get("port")}`
  );
});
```

## Troubleshooting

### Common Issues

- **Configuration not loading**: Ensure files are in the correct directory (config/ folder by default)
- **Environment variables not appearing**: Check that .env files are properly formatted (KEY=VALUE format)
- **Priority conflicts**: Verify merge order in the priority array matches your requirements
- **File not found warnings**: These are informational; TinyConfig will continue with available files

### Debugging

Enable detailed logging by checking the console output:

```bash

# The list command shows which files are found

node TinyConfig/bin/tiny-config list

# The validate command reports on configuration loading success

node TinyConfig/bin/tiny-config validate
```

## Dependencies

- **js-yaml**: YAML file parsing (required for YAML support)
- **dotenv**: .env file parsing (required for environment variable support)

Install with:

```bash
npm install js-yaml dotenv
```

Optional dependencies for additional formats (not included in current version):

- **toml**: TOML file parsing
- **xml2js**: XML file parsing

## License

This project is available for use under standard open-source licensing terms. See the project repository for detailed license information.

```

```
