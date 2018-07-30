const router = require('express').Router();

const bodyValidator = require('../middlewares/bodyValidator');
const transactionService = require('../services/transactionService');
const accountRepo = require('../repository/accountRepository');
const transactionRepo = require('../repository/transactionRepository');
const Constants = require('../models/constants');
const contributionTrxSchema = require('../validators/contributionTrxSchema');

/*
 *      problem/
 * We would like to enable people to buy tokens during the ico
 *
 *      way/
 * The user creates three transactions and hands them to us:
 *   1. a purchase transaction to buy the tokens at the current price
 *   2. a success transaction that transfers the tokens to his account
 *   on ico success
 *   3. a failure transaction that restores his payment back to his
 *   account
 * We sign these transactions with our "Token Distribution Account",
 * submit the purchase transaction so we lock in the user's payment, and
 * hold the other two transactions until the ico completes.
 *
 * TODO: Shouldn't we check for offer price? Transaction validation may
 * be needed.
 */
router.post('/contribute', bodyValidator(contributionTrxSchema), async (req, res, next) => {
    const { id: userId } = req.user;
    let { XDR1, XDR2, XDR3, ca2, xlmAmount } = req.body;
    try {
        [paymentTxn, icoSuccessTxn, icoFailTxn] = await Promise.all([
            transactionService.signTransactionByDA(XDR1),
            transactionService.signTransactionByDA(XDR2),
            transactionService.signTransactionByDA(XDR3)
        ])

        var user = await accountRepo.storeContributionTrx(userId, paymentTxn, icoSuccessTxn, icoFailTxn, ca2, xlmAmount);
    } catch (error) {
        next(error);
        return;
    }
    const paymentId = user.contributions[user.contributions.length-1]._id;
    transactionService.submitXdr(paymentTxn).then(function(result){
        transactionRepo.storeTransaction(userId, paymentId, null, Constants.SUCCESS, result.hash);
    }).catch(function(error){
        transactionRepo.storeTransaction(userId, paymentId, error.data.extras.result_codes.transaction, Constants.FAILED, null);
    });

    res.sendStatus(204);
});

/*      outcome/
 * Returns the user profile for the given user id
 */
router.get('/profile', async (req, res, next) => {
    const { id: userId } = req.user;
    try {
        var userDetails = await accountRepo.getUserProfile(userId);
    } catch (error) {
        next(error);
    }
    res.send({ user: userDetails });
});

module.exports = router;
