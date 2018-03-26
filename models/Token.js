const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    secret: String,
    used: { type: Boolean, default: false }
});

module.exports = TokenSchema;