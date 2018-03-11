"use strict";

class EmailSender {
  sendMail(email, emailData) {
    let messageBody = this.getText(emailData);
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