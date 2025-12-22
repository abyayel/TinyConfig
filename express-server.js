
const express = require('express');
const { loadEnvironmentConfig, validateWithSchema } = require('../src/index');

// 1. Load config for current environment (dev/test/prod)
const config = loadEnvironmentConfig();

// 2. Define validation schema for server config
const serverSchema = {
  server: {
    port: { 
      required: true, 
      type: 'number', 
      min: 1024, 
      max: 65535,
      default: 3000 
    },
    host: { 
      required: false, 
      type: 'string', 
      default: 'localhost' 
    },
    name: { 
      required: false, 
      type: 'string', 
      default: 'TinyConfig Express Server' 
    }
  },
  database: {
    url: { 
      required: true, 
      type: 'string' 
    },
    poolSize: { 
      required: false, 
      type: 'number', 
      default: 10 
    }
  },
  security: {
    jwtSecret: { 
      required: true, 
      type: 'string' 
    },
    corsOrigin: { 
      required: false, 
      type: 'string', 
      default: '*' 
    }
  }
};

// 3. Validate configuration
try {
  const validatedConfig = validateWithSchema(config, serverSchema);
  console.log('✅ Configuration validated successfully');
  
  // Use validated config
  const app = express();
  
  // Middleware to add config to requests
  app.use((req, res, next) => {
    req.config = validatedConfig;
    next();
  });
  
  // Routes
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to TinyConfig Express Example',
      server: {
        name: req.config.server.name,
        environment: process.env.NODE_ENV || 'development'
      },
      endpoints: {
        config: '/api/config',
        health: '/api/health',
        status: '/api/status'
      }
    });
  });
  
  app.get('/api/config', (req, res) => {
    // Return safe config (hide secrets)
    const safeConfig = {
      server: req.config.server,
      database: {
        poolSize: req.config.database.poolSize,
        url: '***' // Hide database URL
      },
      security: {
        corsOrigin: req.config.security.corsOrigin,
        jwtSecret: '***' // Hide secret
      }
    };
    res.json(safeConfig);
  });
  
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });
  
  app.get('/api/status', (req, res) => {
    res.json({
      configSources: {
        environment: process.env.NODE_ENV || 'development',
        configFiles: 'Loaded from .env, config.json, config.yaml'
      },
      features: {
        validation: 'Enabled',
        environmentAware: 'Yes',
        priorityMerging: 'Yes'
      }
    });
  });
  
  // Start server
  const PORT = validatedConfig.server.port;
  const HOST = validatedConfig.server.host;
  
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Config: Port ${PORT}, Host ${HOST}`);
    console.log(`Database pool: ${validatedConfig.database.poolSize} connections`);
  });
  
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  process.exit(1);
}