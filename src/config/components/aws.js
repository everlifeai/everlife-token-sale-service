const joi = require('joi')

const schema = joi.object({
    AWS_BUCKET_NAME: joi.string().required(),
    AWS_SECRET_ACCESSKEY: joi.string().required(),
    AWS_ACCESSKEY_ID: joi.string().required(),
    AWS_REGION: joi.string().required(),
    AWS_ENDPOINT: joi.string().required()})
    .unknown()
    .required();

const { error, value: envVars } = joi.validate(process.env, schema)
if (error) {
    throw new Error(`Aws config validation error: ${error}`)
}

const config = {
    bucketName: envVars.AWS_BUCKET_NAME,
    secretAccessKey: envVars.AWS_SECRET_ACCESSKEY,
    accessKeyId: envVars.AWS_ACCESSKEY_ID,
    region: envVars.AWS_REGION,
    endpoint: envVars.AWS_ENDPOINT
};

module.exports = config;