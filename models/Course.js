const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const CourseSchema = new Schema({
    code: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true
    },
    creditHours: {
        type: Number,
    }
});

module.exports = CourseSchema;