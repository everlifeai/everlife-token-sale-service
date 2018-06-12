const Joi = require('joi');

const schema = Joi.object({
    XDR1: Joi.string().required(),
    XDR2: Joi.string().required(),
    XDR3: Joi.string().required(),
});

module.exports = schema;