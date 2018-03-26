const mongoose = require('mongoose');
const User = mongoose.model('User');
const Token = mongoose.model('Token');
const Util = require('../util');
const bcrypt = require('bcrypt');

module.exports.signup = async (req, res, next) => {
    var { username, email, password, confirmPassword, userType } = req.body;    
        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            return Util.error("All fields required", next);
        }
    
        if (password !== confirmPassword) {
            return Util.error("Passwords do not match", next);
        } 
        
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return Util.error("Email already exists", next);
            }
            
            const hash = await bcrypt.hash(password, 10);
            password = hash;

            const user = await User.create({ username, email, password, userType });
            req.session.email = user.email;
            return res.redirect('/profile');
            
        } catch (error) {
            return Util.error(error.message, next);
        }
};

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if ( !email || !password )  return Util.error('All fields required', next);
        
    try {
        const user = await User.findOne({ email });
        if(!user) return Util.error('Invalid email', next);

        bcrypt.compare(password, user.password, function(err, matching) {                
            if(err) return Util.error(err.message, next);

            if(!matching) return Util.error('Password incorrect', next);

            req.session.email = user.email;
            return res.redirect('/profile');
        });
    } catch (error) {
        return Util.error(error.message, next);
    }
};

module.exports.generateToken = async (req, res, next) => {
    const key = Math.floor(Math.random() * 123456789);
    try {
        const secret = await bcrypt.hash(String(key), 10);
        const token = await Token.create({ secret });
        return next();
    } catch (error) {
        console.log(error);
    }
};