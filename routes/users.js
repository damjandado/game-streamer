const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jwt-simple');
const UserSec = require('../models/UserSec');
const passportService = require('../services/passport-jwt');
const config = require('../config');

// -------------------------------------------

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.login = function(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate('local', function(err, user, info) {
    console.log('err', err);
    console.log('user', user);
    console.log('info', info);
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
    req.logIn(user, loginErr => {
      if (loginErr) {
        console.log(loginErr);
        return res.json({ success: false, message: loginErr });
      }
      return res.json({
        success: true,
        message: 'authentication succeeded',
        token: tokenForUser(user),
        email: user.email
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

exports.register = function(req, res, next) {
  UserSec.findOne({ email: req.body.email }, (err, user) => {
    // is email address already in use?
    if (user) {
      res.json({ success: false, message: 'Email already in use' });
      return;
    } else {
      // go ahead and create the new user
      UserSec.create(req.body, err => {
        if (err) {
          console.error(err);
          res.json({ success: false });
          return;
        }
        res.json({ success: true });
        return;
      });
    }
  });
};
