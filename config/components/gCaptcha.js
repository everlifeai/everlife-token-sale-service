const Joi = require('joi')

const schema = Joi.object({
    CAPTCHA_SECRET: Joi.string().required(),
}).unknown()
    .required()

const { error, value: envVars } = Joi.validate(process.env, schema)

if (error) {
    throw new Error('google captcha validation error.')
}

const config = {
    secret: envVars.CAPTCHA_SECRET
}

module.exports = config;