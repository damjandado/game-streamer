const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('users');
const twitchSvc = require('../services/twitch');
const { twitchData } = require('../index');

exports.currentUser = async (req, res) => {
    const currentTime = new Date().getTime();
    if (req.user) {
        if (req.user.tokenExp < currentTime) {
            req.logout();
            return res.send(req.user);
        }
    }
    let twitchAccessToken = await twitchSvc.getToken(req.user?.id, 'currentUser');
    res.send({ user: req.user, twitchAccessToken, twitchData });
};

exports.currentUserDb = async (req, res) => {
    // const user = await User.findOne({ _id: req.user.id });
    console.log('req.user: ', req.user);
    res.send(req.user);
};

exports.checkEmail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.send({ valid: true });
    }
    return res.send({ valid: false });
};

exports.checkUsername = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.send({ valid: true });
    }
    return res.send({ valid: false });
};

exports.changePass = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!req.body.email) {
        return;
    }
    const tempRemoved = await User.findOneAndRemove({ email: req.body.email });
    user.password = req.body.password;
    user.psw = req.body.psw;
    const { email, username, visits, password, psw } = user;
    const userAgain = { email, username, visits, password, psw };
    console.log('User found in DB:', user);
    console.log('-------------------');
    await User.create(userAgain, (err, user) => {
        if (err) {
            return res.send({ valid: false });
        }
        return res.send({ valid: true });
    });
};

exports.comparePass = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) return console.log(err);
        res.send({ isMatch });
    });
};
