FROM node:18-alpine

WORKDIR /app

# 1. Copy the library files (Simulating "npm install tiny-config")
# In a real app, you'd do "COPY package*.json ./" and "RUN npm install"

COPY package.json ./
COPY src ./src
COPY examples ./examples

# 2. Add some fake config files for testing
RUN echo 'API_KEY=production_secret_key' > .env.production
RUN echo '{"database": "prod-db"}' > config.production.json

# 3. Create a runner script
RUN echo "const { loadEnvironmentConfig } = require('./src/index'); \
    console.log('--- DOCKER CONFIG TEST ---'); \
    console.log('Environment:', process.env.NODE_ENV); \
    const config = loadEnvironmentConfig(); \
    console.log('Loaded Config:', JSON.stringify(config, null, 2));" > runner.js

# 4. Run it
CMD ["node", "runner.js"]
