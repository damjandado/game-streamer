const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jwt-simple');

const passportService = require('../services/passport-local');
const keys = require('../config/keys');
const Mailer = require('../services/Mailer');
const userConfirmTemplate = require('../services/emailTemplates/userConfirmTemplate');
const passRecoveryTemplate = require('../services/emailTemplates/passRecoveryTemplate');
const { makeid } = require('./func');

const User = require('../models/User');
const pendingUser = require('../models/pendingUser');

// const Path = require('path-parser');
// const { URL } = require('url');

// -------------------------------------------

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  const token = jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
  return { token, tokenIAT: timestamp, timestamp };
}

exports.login = function(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate('local', function(err, user, info) {
    console.log('err', err);
    console.log('user', user);
    console.log('req.body', req.body);
    console.log('info', info);
    info = info || { message: 'message - undefined' };
    if (err) return next(err);
    if (!user) {
      return res.json({ success: false, message: info.message });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    // Passport exposes a login() function on req (also aliased as logIn())
    // that can be used to establish a login session
    req.logIn(user, async loginErr => {
      if (loginErr) {
        console.log(loginErr);
        return res.json({ success: false, message: loginErr });
      }
      const { token, tokenIAT, timestamp } = tokenForUser(user);
      let tokenExp = req.body.remember
        ? 14 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;
      tokenExp += timestamp;
      await User.updateOne(
        { email: user.email },
        { token, tokenIAT, tokenExp }
      ).exec();
      return res.json({
        success: true,
        name: user.username,
        email: user.email,
        token,
        tokenExp: new Date(tokenExp),
        message: 'authentication succeeded'
      });
    });
  })(req, res, next);
};

// -------------------------------------------

exports.logout = function(req, res, next) {
  // the logout method is added to the request object automatically by Passport
  req.logout();
  return res.json({ success: true });
};

// -------------------------------------------

exports.signup = function(req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.psw) {
    let err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords don't match");
    return next(err);
  }

  let { template, ...pending } = req.body;
  pendingUser.create(pending, (err, user) => {
    if (user) {
      res.json({ success: true });
      return;
    }
  });
};

exports.sendgrid = async (req, res, next) => {
  const { email, template } = req.body;
  console.log('REQUEST body', req.body);

  const mailTemplate =
    template === 'signup' ? userConfirmTemplate : passRecoveryTemplate;

  const user = {
    subject: 'Email link',
    recipients: [{ email }],
    id: makeid(32)
  };

  // Great place to send an email!
  const mailer = new Mailer(user, mailTemplate(user));
  // console.log('mailer', mailer);
  try {
    await mailer.send();
    console.log('mail sent');
    if (template !== 'signup') {
      await User.updateOne({ email }, { userId: user.id });
    } else {
      await pendingUser.updateOne({ email }, { userId: user.id });
    }
    res.send({ success: true, userId: user.id });
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.sgLink = (req, res) => {
  // const p = new Path('/api/users/:formId');
  // const match = p.test(new URL(req.body.url).pathname);
  // if (match) {
  //   res.send({ proceed: true, formId: match.formId });
  // }
  console.log('sgLink req.body', req.body);
  res.redirect('/');
};

exports.sgWebhooks = async (req, res) => {
  console.log('Sendgrid provided link was clicked >');
  console.log('req.body', req.body);
  const { email } = req.body[0];
  console.log('sendgrid webhook | email: ', email);
  let pending = await pendingUser.findOne({ email });
  let { _id, ...unwrap } = pending;
  console.log('> pending...', pending);
  console.log('> user', unwrap);
  if (pending.email) {
    const { username, password, psw, userId } = pending;
    let user = {
      email,
      username,
      password,
      psw,
      userId
    };
    const newUser = new User(user);
    newUser.save((err, user) => {
      if (err) return res.send({ success: false });
      return res.send({ success: true });
    });
  }
};

exports.findByUserId = (req, res) => {
  console.log('req.body on findByUserId');
  console.log('------------------------');
  console.log(req.body);
  if (req.body.user) {
    User.findOne({ userId: req.body.userId }, (err, user) => {
      if (err) console.log(err);
      if (user) {
        console.log('findByUserId:');
        console.log('-------------');
        console.log(user);
        return res.send({ success: true, email: user.email });
      } else {
        return res.send({ error: 'User not found' });
      }
    });
  } else {
    let user = pendingUser.findOne({ userId: req.body.userId });
    if (user) res.send({ success: true, email: user.email });
  }
};
