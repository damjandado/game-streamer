const passport = require("passport");
const jwt = require("jwt-simple");

const keys = require("../config/keys");
const Mailer = require("../services/Mailer");
const userConfirmTemplate = require("../services/emailTemplates/userConfirmTemplate");
const passRecoveryTemplate = require("../services/emailTemplates/passRecoveryTemplate");
const User = require("../models/User");
const pendingUser = require("../models/pendingUser");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  const token = jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
  return { token, tokenIAT: timestamp, timestamp };
}

exports.login = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.send({ success: false, info });
    }
    req.logIn(user, async loginErr => {
      if (loginErr) {
        return res.send({ success: false, info: loginErr });
      }
      const { token, tokenIAT, timestamp } = tokenForUser(user);
      let tokenExp = req.body.remember
        ? 14 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;
      tokenExp += timestamp;
      return res.send({
        success: true,
        token,
        tokenExp: new Date(tokenExp)
      });
    });
  })(req, res, next);
};

// -------------------------------------------

exports.logout = function(req, res, next) {
  req.logout();
  return res.redirect('/');
};

// -------------------------------------------

exports.signup = function(req, res, next) {
  if (req.body.password !== req.body.psw) {
    let err = new Error("Passwords do not match.");
    err.status = 400;
    res.send("passwords don't match");
    return next(err);
  }

  let { template, ...pending } = req.body;
  pendingUser.create(pending, (err, user) => {
    if (user) {
      res.send({ success: true });
      return;
    }
  });
};

exports.sendgrid = async (req, res, next) => {
  const { email, template } = req.body;

  const mailTemplate =
    template === "signup" ? userConfirmTemplate : passRecoveryTemplate;

  const user = {
    subject: "Email link",
    recipients: [{ email }],
    id: 'makeid32',
  };

  const mailer = new Mailer(user, mailTemplate(user));
  try {
    await mailer.send();
    console.log("mail sent");
    if (template !== "signup") {
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
  console.log("sgLink req.body", req.body);
  res.redirect("/");
};

exports.sgWebhooks = async (req, res) => {
  console.log("Sendgrid provided link was clicked >");
  console.log("req.body", req.body);
};

exports.findByUserId = async (req, res) => {
  if (req.body.user) {
    User.findOne({ userId: req.body.userId }, (err, user) => {
      if (err) console.log(err);
      if (user) {
        return res.send({ success: true, email: user.email });
      } else {
        return res.send({ error: "User not found" });
      }
    });
  } else {
    let pending = await pendingUser.findOne({ userId: req.body.userId });
    if (pending.email) {
      const { email, username, password, psw, userId } = pending;
      let user = {
        email,
        username,
        password,
        psw,
        userId,
        egg: true
      };
      console.log("> user", user);
      const newUser = new User(user);
      newUser.save((err, user) => {
        if (err) return res.send({ success: false });
        pendingUser.findOneAndRemove({ email }, (err, user) => {
          if (err) {
            return res.send({ success: false });
          } else {
            return res.send({ success: true, email: pending.email });
          }
        });
      });
    }
  }
};
