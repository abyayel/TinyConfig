TinyConfig

A lightweight and flexible configuration management library for Node.js applications that loads settings from .env, JSON, and YAML files and merges them into a single configuration object.
TinyConfig is designed to be simple, extensible, and ideal for small to medium-sized projects that need clean configuration handling with environment-aware capabilities.

Features

Multi-format Support: Loads configuration from .env, JSON, and YAML files
Environment Aware: Automatically detects environment (production, development, etc.) and loads appropriate overrides
Smart Merging: Overrides configs with priority (Env Variables > YAML > JSON by default)
Customizable Priority: Configurable merge strategy for different use cases
Simple API: Easy to use with sensible defaults
Multiple Files: Supports multiple configuration files per type

Installation

Option 1: From npm (Recommended for Production)
bash
npm install tiny-config

Option 2: From Source (Development/Contributing)
bash
git clone https://github.com/abyayel/TinyConfig.git
cd TinyConfig
npm install

Quick Start

Basic Configuration Loading
const { loadConfig } = require('tiny-config');

// Load with default files (.env, config.json, config.yaml)
const config = loadConfig();

// Or specify custom files
const config = loadConfig({
  envPath: '.env.example',
  jsonPaths: 'config.json',
  yamlPaths: 'config.yaml'
});

console.log('API Key:', config.API_KEY);
console.log('Server Port:', config.server?.port);

Environment-Based Configuration

TinyConfig automatically detects your environment and loads appropriate overrides, making it perfect for different deployment environments.

File Structure
text
.env                    # Default secrets
.env.production         # Production override
.env.development        # Development override
config.json             # Default settings
config.production.json  # Production settings
config.development.json # Development settings
config.yaml             # Default YAML config
config.production.yaml  # Production YAML overrides

Usage

const { loadEnvironmentConfig } = require('tiny-config');

// Automatically detects NODE_ENV or ENVIRONMENT variable
const config = loadEnvironmentConfig();

// Or specify environment manually
const prodConfig = loadEnvironmentConfig('production');
Advanced Usage

Multiple Configuration Files

const config = loadConfig({
  envPath: ['.env', '.env.local'],  // .local overrides .env
  jsonPaths: ['config.default.json', 'config.custom.json'],
  yamlPaths: ['config.yaml', 'secrets.yaml']
});

Custom Merge Priority

const { createConfigLoader } = require('tiny-config');

const loader = createConfigLoader({
  priority: ['env', 'json', 'yaml'] // Custom priority order
});

const config = loader.load();

Multiple Environments

// Development configuration
const devConfig = loadEnvironmentConfig('development');

// Production configuration  
const prodConfig = loadEnvironmentConfig('production');

// Testing configuration
const testConfig = loadEnvironmentConfig('test');

Priority System
Configuration sources are merged with the following priority (highest to lowest):

Environment Variables (.env files)
YAML Configuration Files
JSON Configuration Files

Within each type, later files override earlier ones. Environment-specific files override their generic counterparts.

Example Priority Flow:

.env.local → .env.production → .env
config.production.yaml → config.yaml  
config.production.json → config.json


Docker Support
TinyConfig includes production-ready Docker examples. Check the docker/tiny-config-example/ directory for:

Optimized Dockerfile configuration
Environment variable management
Multi-stage build examples
Security best practices



Examples

Simple Web Server Configuration

const { loadEnvironmentConfig } = require('tiny-config');
const config = loadEnvironmentConfig();

const express = require('express');
const app = express();

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  console.log(`Environment: ${config.environment}`);
});

Database Configuration

const { loadConfig } = require('tiny-config');
const config = loadConfig();

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.name
});

License
MIT License

Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

Support
GitHub Issues: Report bugs or request features
Examples: Check examples/ folder for usage patterns