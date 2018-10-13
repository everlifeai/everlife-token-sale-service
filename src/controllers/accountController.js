const log = require('util').log;
const router = require('express').Router();
const uuidv4 = require('uuid/v4');
const { StrKey } = require('stellar-sdk');

const stellarConfig = require('../config/config').stellar;
const bodyValidator = require('../middlewares/bodyValidator');
const accountRepo = require('../repository/accountRepository');
const purchaseSchema = require('../validators/purchaseSchema');
const coinPaymentsService = require('../services/coinPaymentsService');
const coinMarketCapService = require('../services/coinmarketcapservice');
const { UserError } = require('../errors/customErrors');

const currencyToPaymentSystemMap = new Map([
    ['XLM', 'stellar'],
    ['BTC', 'coinpayments'],
    ['ETH', 'coinpayments']]);

const EVERToUSDExcahangeRate = 0.1;

/**
 *      outcome/
 * Register a pending purchase in the database. At this time we know that the user has shown the intent of purchasing
 * tokens. A purchase consists of:
 *
 *  ever_amount - The amount of EVER which to purchase. Used to compute the amount of payment required in USD.
 *  currency    - The currency being used for payment.
 *  source_ref  - If payment is expected on Stellar this must be the source account used for payment.
 *  issue_to    - The Stellar account in which we will deposit EVER tokens when the payment has been confirmed.
 *
 * The response consists of:
 *
 *  pay_instruction     - Informational text in markdown describing how to complete playment.
 *  buyer_link          - (Optional) A link to complete the payment. Should be opened in a new window.
 *
 */
router.post('/purchase', bodyValidator(purchaseSchema), async (req, res, next) => {

    const { id: userId } = req.user;
    const { ever_amount, currency, source_ref, issue_to } = req.body;

    const payment_system = currencyToPaymentSystemMap.get(currency);
    const amount_expected_USD = ever_amount * EVERToUSDExcahangeRate;
    const user = await accountRepo.getUser(userId);

    try {
        let sourceAccountOrInvoiceRef;
        let response;
        let invoice_info;
        let amount_expected;

        if (user.kycStatus !== 'ACCEPT') {
            throw new UserError('User has not passed KYC.', 400)
        }

        checkDestinationAddress(issue_to);

        switch (payment_system) {
            case 'stellar':
                if (StrKey.isValidEd25519PublicKey(source_ref)) {
                    sourceAccountOrInvoiceRef = source_ref;
                } else {
                    throw new UserError('The supplied source account is not valid, or missing', 400)
                }
                amount_expected = await calculateXLMAmount(amount_expected_USD);
                response = {
                    pay_instruction: `Please pay ${amount_expected} XLM to account \`${stellarConfig.paymentRecipient}\` to complete the purchase.`
                };
                break;
            case 'coinpayments':
                const invoice_ref = uuidv4();
                invoice_info = await coinPaymentsService.generateInvoice(amount_expected_USD, currency, invoice_ref, user.name, user.email);
                sourceAccountOrInvoiceRef = invoice_info.txn_id;
                amount_expected = invoice_info.amount;
                response = {
                    pay_instruction: `Please click the purchase button below to complete the purchase.`,
                    payment_link: invoice_info.status_url
                };
                break;
            default:
                throw new Error("Unknown payment system.")
        }
        try {
            await accountRepo.storePurchase(userId, ever_amount, payment_system, currency, amount_expected, sourceAccountOrInvoiceRef, issue_to, invoice_info, response);
            res.send(response);
        } catch (e) {
            log(e);
            throw new UserError('Failed to register the purchase, unable to proceed at this time.', 400)
        }
    } catch (error) {
        next(error);
    }
});

function checkDestinationAddress(address) {
    if (!StrKey.isValidEd25519PublicKey(address)) {
        throw new UserError('The supplied destination account is not valid, or missing', 400);
    }
}

async function calculateXLMAmount(amount_expected_USD) {
    const rateXLMtoUSD = await coinMarketCapService.getXLMToUSDRate();
    const amountXLM = amount_expected_USD / rateXLMtoUSD;
    return Number(amountXLM.toFixed(7));
}

/**      outcome/
 * Returns the user profile for the given user id
 */
router.get('/profile', async (req, res, next) => {
    const { id: userId } = req.user;
    try {
        const userProfile = await accountRepo.getUserProfile(userId);
        const aggregates = await accountRepo.getAggregates(userId);
        res.send({
            user: userProfile,
            aggregates: aggregates
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
