var StellarSdk = require('stellar-sdk')

const config = require('../config/config');

// TODO: Get test/production environments to work
var server;
if (config.server.isDevelopment) {
    StellarSdk.Network.useTestNetwork();
    server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
}

const issuingKeypair = StellarSdk.Keypair.fromSecret(config.stellar.issuingSecret);
const distKeypair = StellarSdk.Keypair.fromSecret(config.stellar.distSecret);

/*      outcome/
 * Return the transaction after signing by the Distribution Account
 */
module.exports.signTransactionByDA = async (xdr) => {
    const trx = new StellarSdk.Transaction(xdr);
    trx.sign(distKeypair);
    return trx.toEnvelope().toXDR().toString("base64"),
}



module.exports.allowTrust = async (userPublic) => {
    const account = await server.loadAccount(config.stellar.issuingPublic);
    const transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.allowTrust({
            trustor: userPublic,
            assetCode: config.stellar.assetCode,
            authorize: true,
        })).build();

    transaction.sign(issuingKeypair);
    const result = await server.submitTransaction(transaction);
    return result;
}

module.exports.submitXdr = async (XDR) => {
    const trx = new StellarSdk.Transaction(XDR);
    var result = await server.submitTransaction(trx);

    return result;
}

module.exports.fundTestAccount = async (userPublic) => {
    await server.friendbot(userPublic).call();
    return;
}

