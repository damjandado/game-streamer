const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');

sgMail.setApiKey(keys.sendGridKey);

module.exports = sgMail;
