const mongoose = require('mongoose');
const { Schema } = mongoose;
var bcrypt = require('bcrypt');

const userSchema = new Schema({
  googleId: String,
  twitchId: String,
  email: {
    type: String,
    unique: true,
    // required: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    unique: true,
    // required: true,
    trim: true
  },
  password: {
    type: String,
    // required: true
  },
  passwordConf: {
    type: String,
    // required: true
  },
  credits: { type: Number, default: 0 },
  visits: {
    games: [String],
    users: [String]
  }
});

//authenticate input against database
userSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

//hashing a password before saving it to the database
userSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('users', userSchema);
module.exports = User;
