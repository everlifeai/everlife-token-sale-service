const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports.verifySignature = (idmResponse) => {
    var idmPublicKey = fs.readFileSync(path.resolve(__dirname , '../config/idmPublicKey.txt')); 
    const decoded = jwt.verify(idmResponse, idmPublicKey);
    return decoded;
}