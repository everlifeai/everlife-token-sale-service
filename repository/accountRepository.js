const User = require('./../models/user');

module.exports.payment = async (userId, contributionAddress, xlmAmount) => {
    await User.findByIdAndUpdate(
        userId,
        {
            payment: {
                ca: contributionAddress,
                xlmAmount: xlmAmount
            }
        }
    )
    return;
}

module.exports.storeContributionTrx = async (userId, XDR1, XDR2, XDR3, ca2, xlmAmount) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            "$push": {
                contributions: {
                    xdr1: XDR1,
                    xdr2: XDR2,
                    xdr3: XDR3,
                    ca2: ca2,
                    xlmAmount: xlmAmount
                }
            }
        },
        {
            new: true
        }
    )
    return user;
}

module.exports.getUserProfile = async (userId) => {
    const userDetails = await User.findById(userId)
        .select({
            name: 1,
            email: 1,
            contributions: 1,
            whitelist: 1,
            kyc: 1,
        });
    return userDetails;
}
