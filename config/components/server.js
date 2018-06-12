const joi = require('joi');

const schema = joi.object({
    NODE_ENV: joi.string()
        .allow(['development', 'production', 'test'])
        .required(),
    PORT: joi.string()
}).unknown()
    .required()

const { error, value: envVars } = joi.validate(process.env, schema);

if (error) {
    throw new Error(`Server config validation error ${error}`);
}

const config = {
    env: envVars.NODE_ENV,
    isTest: envVars.NODE_ENV === 'test',
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    port: envVars.PORT
}

module.exports = config;