//const emailConfig = require('./email-config')();
const emailConfig = require('../config/config');
const mailgun = require('mailgun-js')(emailConfig.mailgun);
const pug = require('pug');



module.exports.sendEmail = (recipient, message, attachment) =>
  new Promise((resolve, reject) => {

    // Compile the pub Template
    const compiledFunction = pug.compileFile(message.assetname);
    // Render a set of data

    const pugMessage = compiledFunction({
      name: recipient.name
    });

    console.log("subject: "+message.subject);


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
        //return reject(error);
        console.log("Error Sending Email", data);

      }
      console.log(body);
    });
  });
