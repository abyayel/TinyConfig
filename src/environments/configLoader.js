const { loadConfig } = require('../index');
const { detectEnvironment } = require('./environmentDetector');

function loadEnvironmentConfig(env = null) {
    // Use provided env OR detect it
    const environment = env || detectEnvironment();

    console.log(`🌍 Loading configuration for: ${environment.toUpperCase()}`);

    // Load with specific priority for this environment
    return loadConfig({
        // Files to look for (in order of preference)
        envPath: [
            `.env.${environment}.local`,
            `.env.${environment}`,
            '.env.local',
            '.env'
        ],
        jsonPaths: [
            `config.${environment}.json`,
            'config.json'
        ],
        yamlPaths: [
            `config.${environment}.yaml`,
            'config.yaml'
        ],
        priority: ['env', 'yaml', 'json']
    });
}

module.exports = { loadEnvironmentConfig };