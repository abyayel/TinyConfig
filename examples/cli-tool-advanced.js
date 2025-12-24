#!/usr/bin/env node

const { loadConfig, loadEnvironmentConfig, validateWithSchema } = require('../src/index');
const fs = require('fs');
const path = require('path');

class ConfigCLI {
  constructor() {
    this.config = loadConfig();
    this.commands = {
      'show': this.showConfig.bind(this),
      'validate': this.validateConfig.bind(this),
      'env': this.showEnvironment.bind(this),
      'keys': this.listKeys.bind(this),
      'get': this.getValue.bind(this),
      'template': this.generateTemplate.bind(this),
      'help': this.showHelp.bind(this)
    };
  }

  showConfig() {
    console.log(JSON.stringify(this.config, null, 2));
  }

  validateConfig() {
    const schema = {
      API_KEY: { required: true, type: 'string' },
      DATABASE_URL: { required: true, type: 'string' }
    };
    
    try {
      validateWithSchema(this.config, schema);
      console.log(' All required configuration is present');
      console.log(` Found ${Object.keys(this.config).length} configuration keys`);
    } catch (error) {
      console.error(' Validation failed:', error.message);
      process.exit(1);
    }
  }

  showEnvironment() {
    const envConfig = loadEnvironmentConfig();
    console.log('Current Environment Configuration:');
    console.log('==================================');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Config files loaded:');
    console.log(`  - .env.${process.env.NODE_ENV || 'development'} (if exists)`);
    console.log('  - .env.local (if exists)');
    console.log('  - .env');
    console.log(`  - config.${process.env.NODE_ENV || 'development'}.json (if exists)`);
    console.log('  - config.json');
    console.log(`  - config.${process.env.NODE_ENV || 'development'}.yaml (if exists)`);
    console.log('  - config.yaml');
  }

  listKeys() {
    const keys = Object.keys(this.config);
    console.log(`📋 Configuration Keys (${keys.length} total):`);
    console.log('==================================');
    keys.forEach(key => {
      const value = this.config[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`  ${key}: ${type} ${typeof value === 'object' ? '[object]' : `= ${value}`}`);
    });
  }

  getValue() {
    const key = process.argv[3];
    if (!key) {
      console.error('Please specify a key: node cli-tool.js get <key>');
      process.exit(1);
    }
    
    const value = this.config[key];
    if (value === undefined) {
      console.error(`Key "${key}" not found in configuration`);
      process.exit(1);
    }
    
    console.log(`${key} = ${JSON.stringify(value, null, 2)}`);
  }

  generateTemplate() {
    const templates = {
      '.env': `# Application Environment Variables
API_KEY=your_api_key_here
DATABASE_URL=mongodb://localhost:27017/yourdb
NODE_ENV=development
DEBUG=true
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password`,

      'config.json': `{
  "server": {
    "port": 3000,
    "host": "localhost",
    "name": "My Application"
  },
  "database": {
    "poolSize": 10,
    "timeout": 5000
  },
  "features": {
    "cache": true,
    "logging": true,
    "analytics": false
  }
}`,

      'config.yaml': `# Server Configuration
server:
  port: 3000
  host: localhost
  name: My Application

# Database Configuration  
database:
  poolSize: 10
  timeout: 5000

# Feature Flags
features:
  cache: true
  logging: true
  analytics: false
  maintenance: false`
    };
Object.entries(templates).forEach(([filename, content]) => {
      fs.writeFileSync(`${filename}.template`, content);
      console.log(`Created ${filename}.template`);
    });
    
    console.log('\n Template files created!');
    console.log('To use:');
    console.log('  1. cp .env.template .env');
    console.log('  2. cp config.json.template config.json');
    console.log('  3. cp config.yaml.template config.yaml');
    console.log('  4. Edit the files with your actual values');
  }

  showHelp() {
    console.log(`TinyConfig CLI Example
=======================

This demonstrates a real CLI tool using TinyConfig for configuration management.

Commands:
  show         - Display all configuration
  validate     - Validate required configuration
  env          - Show environment information
  keys         - List all configuration keys
  get <key>    - Get specific configuration value
  template     - Generate configuration templates
  help         - Show this help message

Examples:
  node examples/cli-tool.js show
  node examples/cli-tool.js validate
  node examples/cli-tool.js get API_KEY
  node examples/cli-tool.js template

Configuration Sources:
  - .env file (environment variables)
  - config.json (JSON configuration)
  - config.yaml (YAML configuration)
  - Environment-specific files (e.g., .env.production)
`);
  }

  run() {
    const command = process.argv[2] || 'help';
    
    if (this.commands[command]) {
      this.commands[command]();
    } else {
      console.error(`Unknown command: ${command}`);
      this.showHelp();
      process.exit(1);
    }
  }
}

// Run the CLI
const cli = new ConfigCLI();
cli.run();