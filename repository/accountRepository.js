const User = require('./../models/user');

module.exports.payment = async (userId, contributionAddress, xlmAmount) => {
    await User.findByIdAndUpdate(
        userId,
        {
            payment:{
                ca: contributionAddress,
                xlmAmount: xlmAmount
            }
        }
    )
    return;
}

module.exports.storeContributionTrx = async (userId, XDR2, XDR3, ca2, xlmAmount) => {
    await User.findByIdAndUpdate(
        userId,
        {
            contribution: {
                trx2: XDR2,
                trx3: XDR3,
                ca2: ca2,
                xlmAmount: xlmAmount
            }
        }
    )
    return;
}

module.exports.getUserProfile = async (userId) => {
    const userDetails = await User.findById(userId)
        .select({
            name: 1,
            email: 1,
            contribution: 1,
            whitelist: 1,
            kyc: 1,
            ca: 1
        });
    return userDetails;
}
