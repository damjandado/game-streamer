// const Path = require('path-parser');
const axios = require('axios');
const { URL } = require('url');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const requireLogin = require('../middlewares/requireLogin');
const localFuncs = require('./localFuncs');
const twitch = require('./twitch');
const users = require('./users');
const Mailer = require('../services/Mailer');
const userConfirmTemplate = require('../services/emailTemplates/userConfirmTemplate');
const passRecoveryTemplate = require('../services/emailTemplates/passRecoveryTemplate');

const User = mongoose.model('users');
const Game = mongoose.model('games');
const twitchClientID = require('../config/keys').twitchClientID;

const {
  featuredApi,
  topGamesApi,
  fetchBroadcasters,
  fetchGameStreams,
  processQuery,
  flatten,
  remove_duplicates_es6,
  count_items,
  sortProperties,
  makeid
} = require('./func.js');

module.exports = app => {
  app.post('/local/login', localFuncs.login);
  app.post('/local/signup', localFuncs.signup);
  app.get('/api/current_user', users.currentUser);
  app.get('/api/current_user_db', requireLogin, users.currentUserDb);
  app.get('/api/logout', localFuncs.logout);

  app.post('/api/users/webhooks', localFuncs.sgWebhooks);
  app.post('/api/users/userid', localFuncs.findByUserId);
  app.post('/api/send_email', localFuncs.sendgrid);
  app.get('/api/password_recovery/:formId', localFuncs.sgLink);

  app.post('/api/check_email', users.checkEmail);
  app.post('/api/check_username', users.checkUsername);
  app.post('/api/change_pass', users.changePass);
  app.post('/api/compare_pass', users.comparePass);

  app.get('/api/twitch/games', requireLogin, twitch.games);
  app.post('/api/twitch/users', requireLogin, twitch.users);
  app.get('/api/twitch/dashboard', requireLogin, twitch.dashboard);

  // app.post('/api/registration', async (req, res) => {
  //   if (req.body.logemail && req.body.logpassword) {
  //     console.log('req.session', req.session);
  //     await User.authenticate(req.body.logemail, req.body.logpassword, function(
  //       error,
  //       user
  //     ) {
  //       console.log('User.authenticate gives this back - ', user);
  //       if (error || !user) {
  //         var err = new Error('Wrong email or password.');
  //         err.status = 401;
  //         return next(err);
  //       } else {
  //         req.session.userId = user._id;
  //         res.send(user);
  //       }
  //     });
  //   } else {
  //     var err = new Error('All fields required.');
  //     err.status = 400;
  //     return next(err);
  //   }
  // });

  // GET route after registering
  // app.get('/auth/local', function(req, res, next) {
  //   User.findById(req.session.userId).exec(function(error, user) {
  //     console.log('req.user - ', req.user);
  //     if (error) {
  //       return next(error);
  //     } else {
  //       if (user === null) {
  //         var err = new Error('Not authorized! Go back!');
  //         err.status = 400;
  //         return next(err);
  //       } else {
  //         return res.send('user');
  //       }
  //     }
  //   });
  // });
};
