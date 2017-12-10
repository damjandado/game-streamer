const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  twitchId: String,
  credits: { type: Number, default: 0 },
  visits: {
    games: [String],
    users: [String]
  }
});

mongoose.model('users', userSchema);
