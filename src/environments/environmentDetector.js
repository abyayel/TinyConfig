/**
 * Detect the current runtime environment
 * @returns {string} 'development', 'test', 'staging', or 'production'
 */
function detectEnvironment() {
    // 1. Explicit override
    if (process.env.NODE_ENV) return process.env.NODE_ENV;
    if (process.env.ENVIRONMENT) return process.env.ENVIRONMENT;

    // 2. Hostname detection (e.g., 'web-prod-01')
    if (process.env.HOSTNAME && process.env.HOSTNAME.includes('prod')) {
        return 'production';
    }

    // 3. User detection (Root usually means prod)
    if (process.env.USER === 'root') {
        return 'production';
    }

    // 4. Default
    return 'development';
}

function isProduction() {
    return detectEnvironment() === 'production';
}

function isDevelopment() {
    return detectEnvironment() === 'development';
}

module.exports = { detectEnvironment, isProduction, isDevelopment };