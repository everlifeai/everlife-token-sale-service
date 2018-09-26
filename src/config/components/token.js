const joi = require('joi')

const schema = joi.object({
    TOKEN_SECRET: joi.string().required(),
}).unknown()
    .required()

const { error, value: envVars } = joi.validate(process.env, schema)

if (error) {
    throw new Error('Token secret validation error')
}

const config = {
    secret: envVars.TOKEN_SECRET
}

module.exports = config;