const joi = require('joi')

const schema = joi.object({
    DB_CONNECTION_STRING: joi.string()
}).unknown()
    .required()

const { error, value: envVars } = joi.validate(process.env, schema)

if (error) {
    throw new Error(`DB server config validation error ${error}`);
}

const config = {
    connectionString: envVars.DB_CONNECTION_STRING
}

module.exports = config;