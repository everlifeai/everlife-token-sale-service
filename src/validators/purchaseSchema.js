const Joi = require('joi');

const schema = Joi.object({
    ever_amount: Joi.number().required(),
    currency: Joi.string().required().allow('XLM', 'BTC', 'ETH'),
    source_ref: Joi.string(),
    issue_to: Joi.string().required()
});

module.exports = schema;