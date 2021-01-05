const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const pendingUserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        // required: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        unique: true,
        // required: true,
        trim: true,
    },
    password: {
        type: String,
        // required: true
    },
    psw: {
        type: String,
        // required: true
    },
    userId: String,
});

//hashing a password before saving it to the database
pendingUserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        console.log('USER pass', user.password);
        next();
    });
});

/*
 Defining our own custom document instance method
 */
pendingUserSchema.methods = {
    comparePassword: function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    },
};

/**
 * Statics
 */
// UserSchema.statics = {}

const pendingUser = mongoose.model('pendingUsers', pendingUserSchema);
module.exports = pendingUser;
