const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema({
  broadcaster_language: String,
  created_at: Date,
  display_name: String,
  followers: Number,
  games: [String],
  language: String,
  logo: String,
  mature: Boolean,
  name: String,
  partner: Boolean,
  profile_banner: String,
  status: String,
  updated_at: Date,
  url: String,
  video_banner: String,
  views: Number,
  channel_id: Number,
  _links: [String]
});

mongoose.model('channels', channelSchema);