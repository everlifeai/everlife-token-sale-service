const { User } = require('everlife-token-sale-model');

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

    const user = await User.findById(userId);

    let purchases = [];
    user.purchases
        .forEach(p => {

            let ever_amount = 0,
                ever_bonus = 0;

            if (['ISSUED'].includes(p.status)) {
                p.credited_payments.forEach(c => {
                    ever_amount += c.ever;
                    ever_bonus += c.ever_bonus;
                });
            }

            purchases.push({
                status: p.status,
                user_instruction: p.user_instruction,
                ever_expected: p.ever_expected,
                currency: p.currency,
                amount_expected: p.amount_expected,
                createdAt: p.createdAt,
                ever_amount: ever_amount,
                ever_bonus: ever_bonus
            });
        });


    const profile = {
        name: user.name,
        email: user.email,
        whitelist: user.whitelist,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        isVerifier: user.isVerifier,
        kyc: user.kyc,
        kycStatus: user.kycStatus,
        kycDocs: user.kycDocs,
        idmStatus: user.idmStatus,
        purchases: purchases
    };
    return profile;

};


module.exports.getAggregates = async (userId) => {

    const user = await User.findById(userId);

    let ever_amount = 0,
        ever_bonus = 0;

    user.purchases
        .filter(p => ['ISSUED'].includes(p.status))
        .forEach(p => {
            p.credited_payments.forEach(c => {
                ever_amount += c.ever;
                ever_bonus += c.ever_bonus;
            });
        });

    return {
        ever_amount: ever_amount,
        ever_bonus: ever_bonus,
        ever_total: ever_amount+ever_bonus
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
            "idmStatus": idmStatus,
            "kycStatus":"PENDING"
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
  return await User.find({isVerifier: false,isAdmin:false,kycStatus: "PENDING"}, function(err, user) {
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
