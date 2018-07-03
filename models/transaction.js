var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: String, required: true },
    trxHash: { type: String, default: null },
    response: { type: String, default: null },
    status: { type: String, required: true },
},
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', schema);

module.exports = Transaction;
