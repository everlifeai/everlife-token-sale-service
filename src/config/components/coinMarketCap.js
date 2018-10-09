const joi = require('joi')

const schema = joi.object({
    COINMARKETCAP_APIKEY: joi.string().required()})
    .unknown()
    .required();

const { error, value: envVars } = joi.validate(process.env, schema);
if (error) {
    throw new Error(`CoinMarketCap config validation error: ${error}`);
}

const config = {
    coinMarketCapApiKey: envVars.COINMARKETCAP_APIKEY,
};

module.exports = config;