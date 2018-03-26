const mongoose = require('mongoose');
const { Schema } = mongoose;

const MailSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    recipients: [String],
    sender: String
}, { timestamps: true });

module.exports = MailSchema;