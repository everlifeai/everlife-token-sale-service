const Transaction = require('./../models/transaction');

module.exports.storeTransaction = async function (userId, paymentId, response, status, hash) {
    const transaction = new Transaction({
        user: userId,
        paymentId: paymentId,
        trxHash: hash,
        response: response,
        status: status,
    })

    const trx = await transaction.save();
    return trx;
}
