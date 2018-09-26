const router = require('express').Router();
const uuidv4 = require('uuid/v4');
const { StrKey } = require('stellar-sdk');

const bodyValidator = require('../middlewares/bodyValidator');
const accountRepo = require('../repository/accountRepository');
const purchaseSchema = require('../validators/purchaseSchema');
const coinPaymentsService = require('../services/coinPaymentsService')
const { UserError } = require('../errors/customErrors');

const currencyToPaymentSystemMap = new Map([
    ['XLM', 'STELLAR'],
    ['BTC', 'COINPAYMENTS'],
    ['ETH', 'COINPAYMENTS']]);

const EVERToUSDExcahangeRate = 0.1;
const USDToXLMExchangeRate = 1 / 0.25; //TODO: Get real time updates from market.

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

    try {
        let sourceAccountOrInvoiceRef;
        let response;
        let invoice_info;
        let amount_expected;

        checkDestinationAddress(issue_to);

        switch (payment_system) {
            case 'STELLAR':
                if (StrKey.isValidEd25519PublicKey(source_ref)) {
                    sourceAccountOrInvoiceRef = source_ref;
                } else {
                    throw new UserError('The supplied source account is not valid, or missing')
                }
                amount_expected = calculateXLMAmount(amount_expected_USD);
                response = {
                    pay_instruction: `Please pay ${amount_expected} XLM to account G123 to complete the purchase.`
                };
                break;
            case 'COINPAYMENTS':
                const userProfile = await accountRepo.getUserProfile(userId);
                const invoice_ref = uuidv4();
                invoice_info = await coinPaymentsService.generateInvoice(amount_expected_USD, currency, invoice_ref, userProfile.name, userProfile.email);
                sourceAccountOrInvoiceRef = invoice_ref;
                amount_expected = invoice_info.amount;
                response = {
                    pay_instruction: `Please click the purchase button below to complete the purchase.`,
                    buyer_link: invoice_info.status_url
                };
                break;
            default:
                throw new Error("Unknown payment system.")
        }
        await accountRepo.storePurchase(userId, ever_amount, payment_system, currency, amount_expected, sourceAccountOrInvoiceRef, issue_to, invoice_info, response);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

function checkDestinationAddress(address) {
    if (!StrKey.isValidEd25519PublicKey(address)) {
        throw new UserError('The supplied destination account is not valid, or missing');
    }
    //TODO: Validate address, it must be live and have trustline also (this we can probably check on the front end)
}

function calculateXLMAmount(amount_expected_USD) {
    return amount_expected_USD * USDToXLMExchangeRate; //TODO: Get real time update from exchange
}

/**      outcome/
 * Returns the user profile for the given user id
 */
router.get('/profile', async (req, res, next) => {
    const { id: userId } = req.user;
    try {
        var userProfile = await accountRepo.getUserProfile(userId);
        res.send({ user: userProfile });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
