const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('users');

exports.currentUser = (req, res) => {
  const currentTime = new Date().getTime();
  if (req.user) {
    if (req.user.tokenExp < currentTime) {
      req.logout();
      console.log('U S E R after req.logout()', req.user);
      return res.send(req.user);
    }
  }
  res.send(req.user);
};

exports.currentUserDb = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  console.log('req.user: ', req.user);
  res.send(user);
};

exports.checkEmail = async (req, res) => {
  console.log('CHECK-MAIL');
  const user = await User.findOne({ email: req.body.email });
  console.log('user', user);
  if (user) {
    return res.send({ valid: true });
  }
  return res.send({ valid: false });
};

exports.checkUsername = async (req, res) => {
  console.log('CHECK-USERNAME');
  const user = await User.findOne({ username: req.body.username });
  console.log('user', user);
  if (user) {
    return res.send({ valid: true });
  }
  return res.send({ valid: false });
};

exports.changePass = async (req, res) => {
  console.log('changepass', req.body);
  const user = await User.findOne({ email: req.body.email });
  if (!req.body.email) {
    console.log('Return here');
    return;
  }
  const tempRemoved = await User.findOneAndRemove({ email: req.body.email });
  user.password = req.body.password;
  user.psw = req.body.psw;
  const { email, username, visits, password, psw } = user;
  const userAgain = { email, username, visits, password, psw };
  console.log('User found in DB:', user);
  console.log('-------------------');
  console.log('User to save in DB:', userAgain);
  console.log('-------------------');
  // console.log('user %s and removed %s', user, tempRemoved);
  await User.create(userAgain, (err, user) => {
    if (err) {
      console.error(err);
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

