const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
  game: String,
  genre: String,
  category: String,
  viewers: Number,
  average_fps: Number,
  video_height: Number,
  mature: Boolean
});

mongoose.model('games', gameSchema);