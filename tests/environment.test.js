const {
    detectEnvironment,
    isProduction,
    isDevelopment
} = require('../src/environments/environmentDetector');

const { loadEnvironmentConfig } = require('../src/environments/configLoader');


describe('Environment Detection', () => {
    let originalEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test('detects production from NODE_ENV', () => {
        process.env.NODE_ENV = 'production';
        expect(detectEnvironment()).toBe('production');
        expect(isProduction()).toBe(true);
        expect(isDevelopment()).toBe(false);
    });

    test('detects development by default', () => {
        delete process.env.NODE_ENV;
        delete process.env.ENVIRONMENT;
        delete process.env.HOSTNAME;
        process.env.USER = 'normaluser';

        expect(detectEnvironment()).toBe('development');
        expect(isDevelopment()).toBe(true);
    });

    test('detects staging from ENVIRONMENT variable', () => {
        delete process.env.NODE_ENV;
        process.env.ENVIRONMENT = 'staging';
        expect(detectEnvironment()).toBe('staging');
    });

    test('detects production from HOSTNAME', () => {
        delete process.env.NODE_ENV;
        process.env.HOSTNAME = 'app-prod-01';
        expect(detectEnvironment()).toBe('production');
    });
});

describe('Environment Config Loading', () => {
    // We will test that it doesn't crash. 
    // Detailed file loading logic is tested in the core library or integration tests.

    test('loads config without crashing', () => {
        const config = loadEnvironmentConfig('development');
        expect(typeof config).toBe('object');
    });

    test('handles missing environment files gracefully', () => {
        const config = loadEnvironmentConfig('nonexistent_env');
        expect(typeof config).toBe('object');
    });
});
