const Joi = require('joi')

const schema = Joi.object({
    ASSET_CODE: Joi.string().required(),
    ISSUING_PUBLIC: Joi.string().required(),
    ISSUING_SECRET: Joi.string().required(),
    DIST_PUBLIC: Joi.string().required(),
    DIST_SECRET: Joi.string().required(),
    STELLAR_ENV: Joi.string().required(),
}).unknown()
    .required()

const { error, value: envVars } = Joi.validate(process.env, schema)

if (error) {
    throw new Error(`Stellar environment variables incorrect ${error}`);
}

const config = {
    assetCode: envVars.ASSET_CODE,
    issuingPublic: envVars.ISSUING_PUBLIC,
    issuingSecret: envVars.ISSUING_SECRET,
    distPublic: envVars.DIST_PUBLIC,
    distSecret: envVars.DIST_SECRET,
    isDevelopment: envVars.STELLAR_ENV === 'development',
    isProduction: envVars.STELLAR_ENV === 'production',
}

module.exports = config;
