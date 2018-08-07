const Joi = require('joi');

const schema = Joi.object({
    document1: Joi.string().required(),
    document2: Joi.string().required()
});

module.exports = schema;