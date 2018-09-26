const joi = require('joi')

const schema = joi.object({
    COINPAYMENTS_KEY: joi.string().required(),
    COINPAYMENTS_SECRET: joi.string().required()})
    .unknown()
    .required();

const { error, value: envVars } = joi.validate(process.env, schema);
if (error) {
    throw new Error(`CoinPayment config validation error: ${error}`);
}

const config = {
    api_key: envVars.COINPAYMENTS_KEY,
    api_secret: envVars.COINPAYMENTS_SECRET,
};

module.exports = config;