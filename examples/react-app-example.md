# Using TinyConfig Patterns with React

While TinyConfig is a Node.js library, the same configuration patterns can be applied to React applications.

## 1. Environment-Based Configuration

Create environment files in your React project root:

### .env.development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_DEBUG=true
REACT_APP_VERSION=1.0.0
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=


### .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_DEBUG=false
REACT_APP_VERSION=1.0.0
REACT_APP_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/123456
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXX-Y


### .env.test
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DEBUG=true
REACT_APP_VERSION=test
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=


## 2. Configuration Utility (config.js)

Create a configuration utility that mimics TinyConfig patterns:

// src/config.js
class ReactConfig {
  static load() {
    const env = process.env.NODE_ENV  'development';
    
    // Base configuration
    const baseConfig = {
      apiUrl: process.env.REACT_APP_API_URL  'http://localhost:3000/api',
      debug: process.env.REACT_APP_DEBUG === 'true',
      version: process.env.REACT_APP_VERSION  '1.0.0',
      environment: env,
      sentry: {
        dsn: process.env.REACT_APP_SENTRY_DSN  '',
        enabled: !!process.env.REACT_APP_SENTRY_DSN
      },
      analytics: {
        googleId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
        enabled: !!process.env.REACT_APP_GOOGLE_ANALYTICS_ID
      }
    };
    
    // Environment-specific overrides
    const envOverrides = {
      development: {
        logLevel: 'debug',
        mockApi: true,
        reduxDevTools: true
      },
      production: {
        logLevel: 'error',
        mockApi: false,
        reduxDevTools: false
      },
      test: {
        logLevel: 'silent',
        mockApi: true,
        reduxDevTools: false
      }
    };
    
    return {
      ...baseConfig,
      ...envOverrides[env]
    };
  }
  
  static validate(config) {
    const required = ['apiUrl', 'version'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      console.error(Missing required configuration: ${missing.join(', ')});
      return false;
    }
    
    return true;
  }
}

export default ReactConfig;

3. Usage in React Components

// src/App.js
import React from 'react';
import ReactConfig from './config';

function App() {
  const config = ReactConfig.load();
  
  // Validate on app start
  React.useEffect(() => {
    if (!ReactConfig.validate(config)) {
      console.error('Invalid configuration');
    }
  }, [config]);
  
  return (
    <div className="App">
      <header>
        <h1>My React App v{config.version}</h1>
        <p>Environment: {config.environment}</p>
        {config.debug && (
          <div className="debug-banner">
            Debug Mode Enabled
          </div>
        )}
      </header>
      
      <main>
        <section>
          <h2>API Configuration</h2>
          <p>API URL: {config.apiUrl}</p>
          <p>Mock API: {config.mockApi ? 'Yes' : 'No'}</p>
        </section>
        
        <section>
          <h2>Features</h2>
          <ul>
            <li>Sentry Error Tracking: {config.sentry.enabled ? 'Enabled' : 'Disabled'}</li>
            <li>Google Analytics: {config.analytics.enabled ? 'Enabled' : 'Disabled'}</li>
            <li>Redux DevTools: {config.reduxDevTools ? 'Enabled' : 'Disabled'}</li>
          </ul>
        </section>
      </main>
      
      {config.environment === 'development' && (
        <footer className="dev-footer">
          <h3>Development Tools</h3>
          <button onClick={() => console.log('Current config:', config)}>
            Log Configuration
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;

4. Build Scripts
Update your package.json scripts:
{
  "scripts": {
    "start": "REACT_APP_ENV=development react-scripts start",
    "build": "REACT_APP_ENV=production react-scripts build",
    "build:staging": "REACT_APP_ENV=staging react-scripts build",
    "test": "REACT_APP_ENV=test react-scripts test",
    "eject": "react-scripts eject"
  }
}


5. Docker Deployment

# Dockerfile
FROM node:16-alpine as build

# Set environment
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}

# Copy environment file
COPY .env.${REACT_APP_ENV} .env

# Build app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
