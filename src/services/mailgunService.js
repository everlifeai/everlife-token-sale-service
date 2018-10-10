const emailConfig = require('../config/config');
const mailgun = require('mailgun-js')(emailConfig.mailgun);

module.exports.sendEmail = (recipient, message, attachment) =>
  new Promise((resolve, reject) => {
    const data = {
    //  from: 'Gobinda Thakur <info@mg.gobindathakur.com>',
      from: message.from,
      to: recipient,
      subject: message.subject,
      text: message.text,
      inline: attachment,
      html: message.html,
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) {
        //return reject(error);
        console.log("Error Sending Email", data);

      }
      console.log(body);
    });
  });
