const Joi = require('joi');

const schema = Joi.object({
    ca: Joi.string().required(),
});

module.exports = schema;