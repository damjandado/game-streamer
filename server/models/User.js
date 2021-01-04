const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const visitSchema = new Schema({
  id: String,
  name: String,
  count: Number,
});

const userSchema = new Schema({
  name: String,
  google: {
    id: String,
    photo: String,
    gender: String,
    email: String
  },
  twitch: {
    id: String,
    email: String,
    logo: String,
    bio: String,
    link: String,
    accessToken: String,
  },
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
    type: String
    // required: true
  },
  psw: {
    type: String
    // required: true
  },
  credits: { type: Number, default: 0 },
  visits: {
    games: [visitSchema],
    users: [visitSchema]
  },
  token: String,
  tokenIAT: Date,
  tokenExp: Date,
  userId: String,
  egg: Boolean
});

//authenticate input against database
userSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
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
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  if (user.get("egg")) return next();
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    console.log("USER pass", user.password);
    next();
  });
});

/*
 Defining our own custom document instance method
 */
userSchema.methods = {
  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
};

/**
 * Statics
 */
// UserSchema.statics = {}

const User = mongoose.model("users", userSchema);
module.exports = User;
