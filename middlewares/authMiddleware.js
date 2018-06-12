var authService = require('../services/authService');

var verifyToken = function (req, res, next) {
    var idToken = req.get("Authorization");
    if(!idToken){
        res.status(401).send({ "error": "Token not provided" });
        return;
    }
    authService.verifyToken(idToken).then(function (verifiedToken) {
        req.user = {
            id: verifiedToken.body.id,
            email: verifiedToken.body.email,
        }
        next();
    }).catch(function (error) {
        res.status(401).send({
            "error": error.message
        });
    })
}

module.exports.verifyToken = verifyToken;