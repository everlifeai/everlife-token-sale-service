const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: [Joi.string().optional(), Joi.allow("")],
    password: Joi.string().required(),
    reCaptchaResponse: Joi.string().required(),
});

module.exports = schema;
