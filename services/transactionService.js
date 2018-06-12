var StellarSdk = require('stellar-sdk')

const config = require('../config/config');

StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const issuingKeypair = StellarSdk.Keypair.fromSecret(config.stellar.issuingSecret);
const distKeypair = StellarSdk.Keypair.fromSecret(config.stellar.distSecret);

module.exports.sendRegistrationEverBonus = async function (userPublic) {
    const account = await server.loadAccount(config.stellar.public);
    const transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.payment({
            destination: userPublic,
            asset: new StellarSdk.Asset(config.stellar.assetCode, config.stellar.issuingPublic),
            amount: config.stellar.regBonus
        })).build();

    transaction.sign(StellarSdk.Keypair.fromSecret(config.stellar.secret));
    const result = await server.submitTransaction(transaction);
    return result;
}

module.exports.allowTrust = async (userPublic) => {
    const account = await server.loadAccount(config.stellar.issuingPublic);
    const transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.allowTrust({
            trustor: userPublic,
            assetCode: config.stellar.assetCode,
            authorize: true,
        })).build();

    transaction.sign(StellarSdk.Keypair.fromSecret(issuingKeypair));
    const result = await server.submitTransaction(transaction);
    return result;
}

module.exports.contribute = async (XDR1) => {
    const trx1 = new StellarSdk.Transaction(XDR1);
    // const trx2 = new StellarSdk.Transaction(XDR2);
    // const trx3 = new StellarSdk.Transaction(XDR3);

    // trx1.sign(StellarSdk.Keypair.fromSecret(distKeypair));
    // trx2.sign(StellarSdk.Keypair.fromSecret(distKeypair));
    // trx3.sign(StellarSdk.Keypair.fromSecret(distKeypair));

    const result = await server.submitTransaction(trx1);
    // return {
    //     signedXDR2: trx2.toEnvelope().toXDR().toString("base64"),
    //     signedXDR3: trx3.toEnvelope().toXDR().toString("base64")
    // };
    return;
}

module.exports.fundTestAccount = async (userPublic) => {
    await server.friendbot(userPublic).call();
    return;
}


