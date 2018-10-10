const router = require('express').Router();

const emailUtil = require('../services/mailgunService');
const authRepository = require('../repository/authRepository');
const { sendEmail } = emailUtil;

/*
 *  Note:- You can send up to 10,000 mails for free.
 *  If you need more than this then you have to pay.
 *  One more thing that if you have entered your credit card details in MailGun then it will send mail to every email ids.
 *  Otherwise it will send email only to “Authorized Recipients”. You have to add it manually in MailGun.
*/

router.post('/mail', async (req, res, next) => {

  const sendEmailUser = await authRepository.getUser(req.user.email);
  if(sendEmailUser.isVerifier==true){
    const { recipient, message } = req.body;
    try {
        await sendEmail(recipient, message);
        res.json({message: 'Your query has been sent'});
        await next();
       } catch (e) {
        await next(e);
     }
  }else{
      res.json({message: 'Permission Denined! Please check EverlifeAI to Enable Email Permissions'});
      console.log('Permission Denined! Please check EverlifeAI to Enable Email Permissions');
      return;
      //await next({ "error": "User don not provided" });
  }

 });









module.exports = router;
