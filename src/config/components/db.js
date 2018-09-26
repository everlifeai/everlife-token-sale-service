const joi = require('joi')

const schema = joi.object({
    DB_CONNECTION_STRING: joi.string().required(),
    DB_NAME: joi.string()
}).unknown()
    .required()

const { error, value: envVars } = joi.validate(process.env, schema)

if (error) {
    throw new Error(`DB server config validation error ${error}`);
}

const config = {
    connectionString: envVars.DB_CONNECTION_STRING,
    name: envVars.DB_NAME
};

module.exports = config;