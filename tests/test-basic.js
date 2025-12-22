const { loadConfig } = require('../src/index');

console.log('Running Basic Test...');

try {
    const config = loadConfig();
    if (config) {
        console.log('✅ loadConfig returned an object');
    } else {
        console.error('❌ loadConfig returned null/undefined');
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
}

console.log('✅ Basic Test Passed');
