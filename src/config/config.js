const stellar = require('./components/stellar');
const server = require('./components/server');
const db = require('./components/db');
const aws = require('./components/aws');
const gCaptcha = require('./components/gCaptcha');
const idm = require('./components/idm');
const coinPayments = require('./components/coinPayments');
const coinMarketCap = require('./components/coinMarketCap');
const mailgun = require('./components/mailgun');

/*      outcome/
 * Load the configuration for the various components from the
 * environment
 */
module.exports = {
    stellar,
    server,
    db,
    aws,
    gCaptcha,
    idm,
    coinPayments,
    coinMarketCap,
    idm,
    mailgun
};
