const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
    source: String,
    accessToken: String,
    refreshToken: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
});

module.exports = mongoose.model('tokens', tokenSchema);