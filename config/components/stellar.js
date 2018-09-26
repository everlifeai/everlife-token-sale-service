const Joi = require('joi')

const schema = Joi.object({
    STELLAR_ASSET_CODE: Joi.string().required(),
    STELLAR_ASSET_ISSUER: Joi.string().required(),
    STELLAR_PAYMENT_RECIPIENT: Joi.string().required(),
    STELLAR_ENV: Joi.string().allow(['development', 'production']).required(),
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, schema)

if (error) {
    throw new Error(`Stellar environment variables incorrect ${error}`);
}

const config = {
    assetCode: envVars.ASSET_CODE,
    assetIssuer: envVars.STELLAR_ASSET_ISSUER,
    paymentRecipient: envVars.STELLAR_PAYMENT_RECIPIENT,
    isDevelopment: envVars.STELLAR_ENV === 'development',
    isProduction: envVars.STELLAR_ENV === 'production',
};

module.exports = config;
