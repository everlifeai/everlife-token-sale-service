const log = require('util').log;
const path = require('path');
const emailConfig = require('../config/config');
const mailgun = require('mailgun-js')(emailConfig.mailgun);
const pug = require('pug');

module.exports.sendEmail = (recipient, message, attachment) =>
    new Promise((resolve, reject) => {

        // Find asset path relative to current file.
        const templatePath = path.join(__dirname, '../..', message.assetname);
        log(`[sendEmail] template path: ${templatePath}`);

        // Compile the pub Template
        const compiledFunction = pug.compileFile(templatePath);
        // Render a set of data

        const pugMessage = compiledFunction({
            name: recipient.name,
            kycDetails:recipient.kycDetails!=null?"Reason : "+recipient.kycDetails:null
        });

        log(`[sendEmail] subject: ${message.subject}`);


        const data = {
            from: message.from,
            to: recipient.email,
            subject: message.subject,
            //text: "",
            inline: attachment,
            html: pugMessage,
        };

        mailgun.messages().send(data, function (error, body) {
            if (error) {
                log(`[sendEmail] Failed to send email: ${error} data:\n`, data);

            }
            console.log(body);
        });
    });
