"use strict";
const mailgun = require('mailgun-js');

class EmailSender {
  async sendMail(email, emailData, emailConfig) {
    let envelope = this.getEmail(email, emailData);
    let mg = mailgun({apiKey: emailConfig.mailgunApiKey, domain: emailConfig.mailgunDomain});

    try {
      await mg.messages().send(envelope);
    } catch (e) {
      console.error(e);
    }
  }

  getEmail(email, emailData) {
    let messageBody = this.getText(emailData);
    let recipient = `${emailData.playerName} <${email}>`;
    
    return {
      from: 'Fantasy Movie League <movie@nickroge.rs>',
      to: recipient,
      bcc: 'movie@nickroge.rs',
      subject: `Your Fantasy Movie League Submissions: ${emailData.seasonName}`,
      text: messageBody,
      "h:sender": 'Fantasy Movie League <movie@nickroge.rs>'
    };
  }

  getText(emailData) {
    let messageBody = `Hey ${emailData.playerName},

Here are the share selections you just made for the Fantasy Movie League (${emailData.seasonName}):

`;
    for (let movie of emailData.movies) {
      messageBody += `\t${movie.name}: ${movie.shares}\n`
    }

    messageBody += `
\tBest Movie Bonus: ${emailData.bonus1}
\tWorst Movie Bonus: ${emailData.bonus2}

--
Thanks,
Nick

`;
    return messageBody;
  }

}

module.exports = EmailSender;