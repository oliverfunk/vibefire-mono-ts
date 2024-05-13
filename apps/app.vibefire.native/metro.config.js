const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const projectRoot = __dirname;

// Create the default Metro config
const config = getSentryExpoConfig(projectRoot);

// support package.json "exports"
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
