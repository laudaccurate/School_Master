const mongoose = require('mongoose');
const User = mongoose.model('User');
const Util = require('../util');

function loggedOut(req, res, next) {
    if (req.session.email) {
        return res.redirect('/profile');
    }
    next();
}

function requiresLogin(req, res, next) {
    if (req.session.email) {
        return next();
    } else {
        const err = new Error('You need to be logged in to access this page');
        err.status = 403;
        return next(err);
        
    }
}

async function isLecturer(req, res, next) {
    try {
        const user = await User.findOne({ email: req.session.email });
        if(user.userType === 'lecturer') {
            return next();
        } else {
            return Util.error("You're not authorised to upload files", next, '403');
        }
    } catch (error) {
        return Util.error(error.message, next, error.status);
    }
}

module.exports = { loggedOut, requiresLogin, isLecturer };