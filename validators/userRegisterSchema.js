const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().allow(['male', 'female']).required(),
    birthdate: Joi.date().required(),
    password: Joi.string().required(),
});

module.exports = schema;
