const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CourseSchema = require('./Course');
const Util = require('../util');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
    },
    userType: {
        type: String,
        lowercase: true,
        trim: true,
    },
    courses: [CourseSchema]
});

// UserSchema.pre("save", function(next) {
//     const user = this;
//     bcrypt.hash(user.password, 10, function(err, hash) {
//         if(err) {
//             return Util.error(err.message, next);
//         }
//         user.password = hash;
//         return next();
//     });
// });

// UserSchema.methods.authenticate = function(candidatePassword, callback) {
//     const user = this;
//     bcrypt.compare(candidatePassword, user.password, function(err, matching) {
//         if(err) 
//             return callback(err, null);
//         else
//             return callback(null, matching);
//     });
// };

module.exports = UserSchema;