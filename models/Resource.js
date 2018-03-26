const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResourceSchema = new Schema({
    _user: String,
    name: String,
    path: String
}, { timestamps: true });

module.exports = ResourceSchema;