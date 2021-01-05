const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');

sgMail.setApiKey(keys.sendGridKey)

class Mailer {
    constructor({ subject, recipients }, content) {
        console.log('recipients', recipients);

        this.sgApi = sgMail.setApiKey(keys.sendGridKey);
        this.from_email = new sgMail.Email('no-reply@game-streamer.herokuapp.com');
        this.subject = subject;
        this.body = new sgMail.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        console.log('this.recipients', this.recipients);

        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses(recipients) {
        return recipients.map(({ email }) => {
            return new sgMail.Email(email);
        });
    }

    addClickTracking() {
        const trackingSettings = new sgMail.TrackingSettings();
        const clickTracking = new sgMail.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    addRecipients() {
        const personalize = new helper.Personalization();
        this.recipients.forEach((recipient) => {
            personalize.addTo(recipient);
        });
        this.addPersonalization(personalize);
    }

    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON(),
        });

        console.log('Mailer.send');

        const response = await this.sgApi.API(request);
        console.log('Mailer.send - response', response);
        return response;
    }
}

module.exports = sgMail;
