const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
  games: []
});

mongoose.model('games', gameSchema);