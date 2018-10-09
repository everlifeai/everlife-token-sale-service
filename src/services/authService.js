var nJwt = require('njwt');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');


/*      understand/
 * We re-generate the token signing key on every restart to make sure it is protected. The only downside to this
 * is that we need to re-login after service restarts.
 */
const tokenSigningKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes


/*      outcome/
 * Verify the client token generated using the secret signing key
 */
module.exports.verifyToken = function (token) {
    return new Promise((resolve, reject) => {
        nJwt.verify(token, tokenSigningKey, function (error, verifiedJwt) {
            if (error) {
                reject(error);
            }
            else {
                resolve(verifiedJwt);
            }
        })
    })
}

/*      outcome/
 * Generate an access token for the given data.
 */
module.exports.generateAccessToken = function(data) {
    data.iss = "https://everlife.ai/";
    var jwt = nJwt.create(data, tokenSigningKey);
    return jwt.compact();
}

/*      outcome/
 * Hash the password for storing safely with a given CPU cost
 * (saltRounds)
 */
const saltRounds = 10;
module.exports.generatePasswordHash = async function (password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

/*      outcome/
 * Check the given password is correct against the hash
 */
module.exports.comparePassword = async function (password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
}
