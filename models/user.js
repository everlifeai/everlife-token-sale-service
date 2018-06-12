var mongoose = require('mongoose');
const { UserError } = require('./../errors/customErrors');

var userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whitelist: { type: Boolean, default: false },
    kyc: { type: Boolean, default: false },
    ca: { type: String, default: null },
    contribution: {
        trx2: { type: String, default: null },
        trx3: { type: String, default: null }
    }
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