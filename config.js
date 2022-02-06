// Container for all the environment
var environments = {};

// Staging {default} environment
environments.staging = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'staging'
}

// Production environment
environments.production = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'production'
}

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is one of the env above {if no default is staging}
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;