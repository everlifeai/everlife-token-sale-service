var mongoose = require('mongoose');
const { UserError } = require('./../errors/customErrors');

const contribution = new mongoose.Schema({
    xdr1: { type: String, default: null },
    xdr2: { type: String, default: null },
    xdr3: { type: String, default: null },
    ca2: { type: String, default: null },
    xlmAmount: { type: Number, default: 0 },
},
    { timestamps: true }
);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    whitelist: { type: Boolean, default: false },
    kyc: { type: Boolean, default: false },
    contributions: [{
        type: contribution,
        default: contribution
    }]
},
    { timestamps: true }
);


var User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
    const user = await User.findOne({ email: this.email });
    if (user) {
        next(new UserError(`User already exist with email: ${this.email}`, 400));
    }
    return;
});

module.exports = User;