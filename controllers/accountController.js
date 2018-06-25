const router = require('express').Router();

const bodyValidator = require('./../middlewares/bodyValidator');
const transactionService = require('./../services/transactionService');
const accountRepo = require('./../repository/accountRepository');

// validation schema
const contributionTrxSchema = require('./../validators/contributionTrxSchema');

router.post('/contribute', bodyValidator(contributionTrxSchema), async (req, res, next) => {
    const { id: userId } = req.user;
    const { XDR1, XDR2, XDR3, ca2, xlmAmount } = req.body;
    try {
        var { signedXDR1, signedXDR2, signedXDR3 } = await transactionService.contribute(XDR1, XDR2, XDR3);
        await accountRepo.storeContributionTrx(userId, signedXDR1, signedXDR2, signedXDR3, ca2, xlmAmount);
    } catch (error) {
        next(error);
        return;
    }
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