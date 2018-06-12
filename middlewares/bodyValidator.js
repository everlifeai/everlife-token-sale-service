const Joi = require('joi');

const bodyValidator = function (schema) {
    return function (req, res, next) {
        Joi.validate(req.body, schema, function (error, data) {
            if (error) {
                res.status(403).send({ error: error.details[0].message });
            } else {
                req.body = data;
                next();
            }
        });
    }
}

module.exports = bodyValidator;