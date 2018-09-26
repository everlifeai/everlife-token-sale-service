const Coinpayments = require('coinpayments'); // https://github.com/OrahKokos/coinpayments
const conf = require('../config/config').coinPayments;

const client = new Coinpayments({
    key: conf.api_key,
    secret: conf.api_secret
});

/**
 * @param amount_expected_USD
 * @param currency
 * @param invoice_ref
 * @param buyer_name
 * @param buyer_email
 * @returns {Promise<*>}
 *  {
 *       amount: '1.21825881',
 *       txn_id: 'd17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c',
 *       address: 'PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx',
 *       confirms_needed: '5',
 *       timeout: 5400,
 *       status_url: 'https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f,
 *       qrcode_url: 'https://www.coinpayments.net/qrgen.php?id=CPBF4COHLYGEZZYIGFDKFY9NDP&key=90e5561c1e8cd4452069f7726d3e0370'
 *   };
 *
 */
async function generateInvoice(amount_expected_USD, currency, invoice_ref, buyer_name, buyer_email) {

    return new Promise((resolve, reject) => {
        const txOptions = {
            currency1: 'USD',           // The original currency (displayed currency) in which the price is presented
            currency2: currency,        // The currency the buyer will be sending
            amount: amount_expected_USD,  // Expected amount to pay, where the price is expressed in `currency1`
            invoice: invoice_ref,       // Custom field, included in IPN
            buyer_name: buyer_name,
            buyer_email: buyer_email,
            item_name: 'EVER Token'

        };
        client.createTransaction(txOptions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

    });
}

module.exports = {
    generateInvoice
};