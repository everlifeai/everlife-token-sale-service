var nJwt = require('njwt');
var bcrypt = require('bcrypt');

var config = require('../config/config');

const saltRounds = 10;

module.exports.verifyToken = function (token) {
    return new Promise((resolve, reject) => {
        nJwt.verify(token, config.token.secret, function (error, verifiedJwt) {
            if (error) {
                reject(error);
            }
            else {
                resolve(verifiedJwt);
            }
        })
    })
}

module.exports.generateAccessToken = function(data) {
    data.iss = "https://everlife.ai/";
    var jwt = nJwt.create(data, config.token.secret);
    return jwt.compact();
}

module.exports.generatePasswordHash = async function (password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

module.exports.comparePassword = async function (password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
}