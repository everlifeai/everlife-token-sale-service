const { User } = require('../../../everlife-token-sale-model/src/index');

/*      outcome/
 * Save a new purchase into the user object.
 */
module.exports.storePurchase = async (userId, ever_expected, payment_system, currency, amount_expected, source_ref, issue_to, invoice_info, user_instruction) => {
    const user = await User.findById(userId);
    user.addPurchase(ever_expected, payment_system, currency, amount_expected, source_ref, issue_to, invoice_info, user_instruction);
    await user.save();
};

module.exports.getUser = async (userId) => {
    return User.findById(userId);
};

/**
 * Return a subset of information about the user which can be sent to the client.
 * IMPORTANT: Sensitive information must not be sent to the client.
 * @param userId
 * @returns {Query}
 */
module.exports.getUserProfile = async (userId) => {
    return User.findById(userId)
        .select({
            name: 1,
            email: 1,
            'purchases.status': 1,
            'purchases.user_instruction': 1,
            'purchases.ever_expected': 1,
            'purchases.currency': 1,
            'purchases.amount_expected': 1,
            whitelist: 1,
            isActive: 1,
            isAdmin: 1,
            isVerifier: 1,
            kyc: 1,
            kycStatus: 1,
            kycDocs: 1,
            idmStatus: 1
        });
};


module.exports.getAggregates = async (userId) => {
    //TODO: Implement computing the issued number of EVERs
    return {
        ever_amount: 123,
        ever_bonus: 12,
        ever_total: 143
    };
};

module.exports.addKycDocuments = async (userId, document1Id, document2Id) => {
    await User.findByIdAndUpdate(
        userId,
        {
            "kycDocs.document1": document1Id,
            "kycDocs.document2": document2Id
        }
    )
};

module.exports.storeIDMStatus = async (userId, idmStatus) => {
    console.log(`[storeIDMStatus] ${userId}: ${idmStatus}`);
    await User.findByIdAndUpdate(
        userId,
        {
            "idmStatus": idmStatus
        }
    );
};

module.exports.storeIDMDetails = async (userId, verifiedIdmResponse) => {
  console.log(`[storeIDMResponse] ${userId}: ${verifiedIdmResponse}`);
    await User.findByIdAndUpdate(
        userId,
        {
            "idmDetails":verifiedIdmResponse
        }
    );
};


module.exports.storeKycDocs = async (userId, document1, document2) => {
    await User.findByIdAndUpdate(
        userId,
        {
          kycDocs: {
              document1,
              document2
          }
        }
    )
};

module.exports.getUserList = async function () {
  return await User.find({isVerifier: false,isAdmin:false,kycStatus: {$nin: ["ACCEPT", "REJECT"]}}, function(err, user) {
      if (err)
      {
          console.log(err);
      }
      return user;
   });
};

module.exports.storeKycStatus = async (userId, kycStatus) => {
  console.log(`[storeKycStatus] ${userId}: ${kycStatus}`);
    await User.findByIdAndUpdate(
        userId,
        {
            "kycStatus":kycStatus
        }
    );
};
