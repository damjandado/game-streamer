const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    id: String,
    name: String,
    box_art_url: String,
});

module.exports = mongoose.model('games', gameSchema);
