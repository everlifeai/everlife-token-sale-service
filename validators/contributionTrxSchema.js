const Joi = require('joi');

const schema = Joi.object({
    XDR1: Joi.string().required(),
    XDR2: Joi.string().required(),
    XDR3: Joi.string().required(),
    ca2: Joi.string().required(),
    xlmAmount: Joi.number().required()
});

module.exports = schema;