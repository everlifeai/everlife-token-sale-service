const router = require('express').Router();

const emailUtil = require('../services/mailgunService');
const { sendEmail } = emailUtil;

/*
 *  Note:- You can send up to 10,000 mails for free.
 *  If you need more than this then you have to pay.
 *  One more thing that if you have entered your credit card details in MailGun then it will send mail to every email ids.
 *  Otherwise it will send email only to “Authorized Recipients”. You have to add it manually in MailGun.
*/

router.post('/mail', async (req, res, next) => {
    const { recipient, message } = req.body;
    try {
        if (!req.user.isVerifier) {
            res.send(401);
            return;
        }
        await sendEmail(recipient, message);
        res.json({message: 'Your query has been sent'});
        await next();
       } catch (e) {
        await next(e);
     }
 });

module.exports = router;
