const mongoose = require('mongoose');
const User = mongoose.model('User');
const Util = require('../util');

module.exports = app => {
    app.get('/users', async (req, res, next) => {
        const user = await User.find();
        return res.json();
    });
};