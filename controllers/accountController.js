const router = require('express').Router();

const bodyValidator = require('../middlewares/bodyValidator');
const transactionService = require('../services/transactionService');
const accountRepo = require('../repository/accountRepository');
const transactionRepo = require('../repository/transactionRepository');
const Constants = require('../models/constants');
// validation schema
const contributionTrxSchema = require('../validators/contributionTrxSchema');

router.post('/contribute', bodyValidator(contributionTrxSchema), async (req, res, next) => {
    const { id: userId } = req.user;
    const { XDR1, XDR2, XDR3, ca2, xlmAmount } = req.body;
    try {

        var { signedXDR1, signedXDR2, signedXDR3 } = await transactionService.signTransactionsByDA(XDR1, XDR2, XDR3);
        var user = await accountRepo.storeContributionTrx(userId, signedXDR1, signedXDR2, signedXDR3, ca2, xlmAmount);
    } catch (error) {
        next(error);
        return;
    }
    const paymentId = user.contributions[user.contributions.length-1]._id;
    transactionService.submitXdr(signedXDR1).then(function(result){
        transactionRepo.storeTransaction(userId, paymentId, null, Constants.SUCCESS, result.hash);
    }).catch(function(error){
        transactionRepo.storeTransaction(userId, paymentId, error.data.extras.result_codes.transaction, Constants.FAILED, null);
    });

    res.sendStatus(204);
});

router.get('/profile', async (req, res, next) => {
    const { id: userId } = req.user;
    try {
        var userDetails = await accountRepo.getUserProfile(userId);
    } catch (error) {
        next(error);
        return;
    }
    res.send({ user: userDetails })
});

module.exports = router;