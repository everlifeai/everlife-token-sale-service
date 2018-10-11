const joi = require('joi');

const schema = joi.object({
    IDM_PUB_KEY_FILE: joi.string().required()
}).unknown()
    .required();

const { error, value: envVars } = joi.validate(process.env, schema);

if (error) {
    throw new Error(`IDM server config validation error ${error}`);
}

const config = {
    idmPubKeyFile: envVars.IDM_PUB_KEY_FILE
};

module.exports = config;