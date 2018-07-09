const stellar = require('./components/stellar');
const token = require('./components/token');
const server = require('./components/server');
const db = require('./components/db');


/*      outcome/
 * Load the configuration for the various components from the
 * environment
 */
module.exports = {
    stellar,
    token,
    server,
    db
}
