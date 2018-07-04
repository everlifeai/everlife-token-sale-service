var authService = require('../services/authService');

/*      problem/
 * We are providing an API and need to ensure that it's not called by
 * arbitrary people on the internet.
 *
 *      way/
 * We expect to get a authorization token for all requests. If it's
 * not given we fail with an authentication error.
 *
 * NB: The request must be over HTTPS.
 */
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
