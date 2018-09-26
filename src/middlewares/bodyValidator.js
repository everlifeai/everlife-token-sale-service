const Joi = require('joi');

/*      outcome/
 * We check the user's request data based on the given schema, setting
 * defaults etc and returning the data.
 */
const bodyValidator = function (schema) {
    return function (req, res, next) {
        Joi.validate(req.body, schema, function (error, data) {
            if (error) {
                res.status(400).send({ error: error.details[0].message });
            } else {
                req.body = data;
                next();
            }
        });
    }
}

module.exports = bodyValidator;
