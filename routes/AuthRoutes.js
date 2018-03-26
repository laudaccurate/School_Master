
const express = require('express');
const mongoose = require('mongoose');
const { loggedOut, requiresLogin } = require('../middleware');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const Token = mongoose.model('Token');
const Util = require('../util');
const AuthController = require('../controllers/AuthControllers');

module.exports = app => {
    app.param('id', async (req, res, next, id) => {
        try {
            const user = await User.findById(id);
            req.user = user;
            return next();
        } catch (error) {
            return Util.error(error.message, next, error.status);
        }
    })

    // app.get('/admin/signup', (req, res, next) => {
    //     return res.render('adminSignup');
    // });

    // app.post('/admin/signup', AuthController.signup);

    app.get('/', function(req, res, next) {
        res.render('home', { title: 'Home'});
    });
    
    app.get('/signup', loggedOut, (req, res, next) => {
        res.render('signup', { title: 'Sign Up'});
    });

    app.post('/signup', AuthController.signup);


    app.get('/login', loggedOut, AuthController.generateToken, function(req, res, next) {
        res.render('login', { title: 'Login'});
    });

    app.post('/login', AuthController.login );

    app.get('/lecturer/signup', loggedOut, async (req, res, next) => {
        const secret = req.query.token;
        try {
            const token = await Token.findOne({ secret });
            if(token && !token.used) {
                await token.remove();
                AuthController.generateToken;
                return res.render('lecturerSignup');
            }
            return Util.error('Not found', next, '404');
        } catch (error) {
            return Util.error(error.message, next);
        }
    });

    app.get('/profile', requiresLogin, async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        return res.render('profile', { user });
    });

    app.get('/logout', requiresLogin, async (req, res, next) => {
        await req.session.destroy();
        return res. redirect('/');
    });
};
