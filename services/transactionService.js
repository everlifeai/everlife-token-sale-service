var StellarSdk = require('stellar-sdk')

const config = require('../config/config');

var server;
if (config.server.isDevelopment) {
    StellarSdk.Network.useTestNetwork();
    server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
}

const issuingKeypair = StellarSdk.Keypair.fromSecret(config.stellar.issuingSecret);
const distKeypair = StellarSdk.Keypair.fromSecret(config.stellar.distSecret);

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

module.exports.signTransactionsByDA = async (XDR1, XDR2, XDR3) => {
    const trx1 = new StellarSdk.Transaction(XDR1);
    const trx2 = new StellarSdk.Transaction(XDR2);
    const trx3 = new StellarSdk.Transaction(XDR3);

    trx1.sign(distKeypair);
    trx2.sign(distKeypair);
    trx3.sign(distKeypair);

    return {
        signedXDR1: trx1.toEnvelope().toXDR().toString("base64"),
        signedXDR2: trx2.toEnvelope().toXDR().toString("base64"),
        signedXDR3: trx3.toEnvelope().toXDR().toString("base64")
    };
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

