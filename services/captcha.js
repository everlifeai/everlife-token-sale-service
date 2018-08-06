const request = require('request-promise');
const config = require('../config/config');

module.exports.isCaptchaSuccess = async function(captchaResponse, remoteIp){
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify"
    let parameters = {
        secret: config.gCaptcha.secret,
        response: captchaResponse,
        remoteip: remoteIp
    };

    // captcha verification
    const result = JSON.parse(await request.post({
        url: verificationUrl,
        form: parameters
    }));

    console.log(result);
    
    return result.success;
}