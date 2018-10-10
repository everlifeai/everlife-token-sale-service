const Joi = require('joi')

const schema = Joi.object({
    MAILGUN_APIKEY: Joi.string().required(),
    MAILGUN_DOMAIN: Joi.string().required(),
}).unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, schema)

if (error) {
    throw new Error(`Mailgun environment variables incorrect ${error}`);
}

const config = {
    apiKey: envVars.MAILGUN_APIKEY,
    domain: envVars.MAILGUN_DOMAIN,
}

module.exports = config;
