const Joi = require('joi');

const schema = Joi.object({
    userPublicAddress: Joi.string().required(),
})

module.exports = schema;