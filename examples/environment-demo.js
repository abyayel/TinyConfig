const {
    detectEnvironment,
    isProduction,
    isDevelopment,
    loadEnvironmentConfig
} = require('../src/index');

console.log('=== TinyConfig Environment Demo ===\n');

// 1. Detect environment
console.log('1. Environment Detection:');
console.log(`   Detected: ${detectEnvironment()}`);
console.log(`   Is Production: ${isProduction()}`);
console.log(`   Is Development: ${isDevelopment()}`);

// 2. Load environment-specific config
console.log('\n2. Loading Environment Config:');
try {
    const config = loadEnvironmentConfig();
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Config keys loaded: ${Object.keys(config).length}`);

    // Show some config
    if (config.server) {
        console.log(`   Server port: ${config.server.port || 'Not set'}`);
    }
} catch (error) {
    console.error(`   Error: ${error.message}`);
}

// 3. Show how to use different environments
console.log('\n3. Environment Switching Example:');
console.log('   To run in production:');
console.log('   $ NODE_ENV=production node examples/environment-demo.js');

console.log('\n=== Demo Complete ===');
