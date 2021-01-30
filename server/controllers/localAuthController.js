const passport = require('passport');
const jwt = require('jwt-simple');

const keys = require('../config/keys');
const mailer = require('../services/mailer');
const userConfirmTemplate = require('../services/emailTemplates/userConfirmTemplate');
const passRecoveryTemplate = require('../services/emailTemplates/passRecoveryTemplate');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const utils = require('../utils/utils');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    const token = jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
    return { token, tokenIAT: timestamp, timestamp };
}

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.send({ success: false, info });
        }
        req.logIn(user, async (loginErr) => {
            if (loginErr) {
                return res.send({ success: false, info: loginErr });
            }
            const { token, tokenIAT, timestamp } = tokenForUser(user);
            let tokenExp = req.body.remember ? 14 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
            tokenExp += timestamp;
            return res.send({
                success: true,
                token,
                tokenExp: new Date(tokenExp),
            });
        });
    })(req, res, next);
};

// -------------------------------------------

exports.logout = function (req, res, next) {
    req.logout();
    return res.redirect('/');
};

// -------------------------------------------

exports.signup = async (req, res, next) => {
    if (req.body.password !== req.body.psw) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords don't match");
        return next(err);
    }

    let { template, ...pending } = req.body;
    try {
        const user = new User(pending).save();
        const pendingUser = new PendingUser(pending).save();
        await Promise.all([user, pendingUser]);
        res.redirect(307, '/api/send_email');
    } catch (err) {
        res.status(422).send(err);
    }
};

exports.sendgrid = async (req, res, next) => {
    const { email, template } = req.body;

    const mailTemplate = template === 'signup' ? userConfirmTemplate : passRecoveryTemplate;
    const id = utils.makeid(9);
    const msg = {
        to: email,
        from: 'damjanspace@gmail.com',
        subject: 'Email link',
        text: 'and easy to do anywhere, even with Node.js',
        html: mailTemplate({ id }),
    };

    try {
        await mailer.send(msg);
        console.log('mail sent');
        const updates = [];
        if (template === 'signup') {
            updates.push(PendingUser.updateOne({ email }, { userId: id }));
        }
        updates.push(User.updateOne({ email }, { userId: id }));
        await Promise.all(updates);
        res.send({ success: true, userId: id });
    } catch (err) {
        res.status(422).send(err);
    }
};

exports.sgLink = (req, res) => {
    console.log('sgLink req.body', req.body);
    res.redirect('/');
};

exports.sgWebhooks = async (req, res) => {
    console.log('Sendgrid provided link was clicked >');
    console.log('req.body', req.body);
};

exports.findByUserId = async (req, res) => {
    if (req.body.user) {
        User.findOne({ userId: req.body.userId }, (err, user) => {
            if (err) console.log(err);
            if (user) {
                return res.send({ success: true, email: user.email });
            } else {
                return res.send({ error: 'User not found' });
            }
        });
    } else {
        let pending = await PendingUser.findOne({ userId: req.body.userId });
        if (pending.email) {
            const { email, username, password, psw, userId } = pending;
            let user = {
                email,
                username,
                password,
                psw,
                userId,
                egg: true,
            };
            console.log('> user', user);
            const newUser = new User(user);
            newUser.save((err, user) => {
                if (err) return res.send({ success: false });
                PendingUser.findOneAndRemove({ email }, (err, user) => {
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

exports.confirmUser = async (req, res) => {
    const user = await User.findOne({ userId: req.params.id });
    req.logIn(user, (loginErr) => {
        if (loginErr) {
            console.log(loginErr);
        }
        res.redirect('/');
    });
};
