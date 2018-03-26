const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const Util = require('../util');
const { requiresLogin } = require('../middleware');

module.exports = app => {
    app.param('id', async (req, res, next, id) => {
        req.course = null;
        try{
            const user = await User.findOne({email: req.session.email});
            if (user.courses.length !== 0) {
                user.courses.forEach(course => {
                    if(String(course._id) === String(id)) {
                        req.course = course;
                    }            
                });
            }
            req.user = user;
            return next();
        } catch(error) {
            return Util.error(error.message, next);
        }
    });

    app.get('/courses', requiresLogin, async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        return res.render('course', { user });
    });

    app.get('/admin/addCourse', requiresLogin, (req, res, next) => {
        return res.render('addCourse');
    });

    app.post('/admin/addCourse', async (req, res, next) => {
        const { title, code, creditHours } = req.body;
        if(!title.trim() || !code.trim() || !creditHours) {
            return Util.error('All fields required', next);
        }

        const course = await Course.create(req.body);
        return res.redirect('/courses');
    });

    app.get('/admin/removeCourse', requiresLogin, async (req, res, next) => {
        const courses = await Course.find();
        return res.render('removeCourse', { courses });
    });

    app.post('/admin/removeCourse', async (req, res, next) => {
        for(key in req.body) {
            if(req.body[key] === 'on') {
                await Course.findByIdAndRemove(key);
            }
        }
        return res.redirect('/courses');
    });

    app.get('/student/registration', async (req, res, next) => {
        const courses = await Course.find();
        return res.render('registration', { courses });
    });

    app.post('/student/addCourse', async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        var existingCourse = null;
        for(key in req.body) {
            if(req.body[key] === 'on') {
                const courseToAdd = await Course.findById(key);
                user.courses.forEach(course => {
                    if(String(course._id) === String(key)) {
                        existingCourse = course;
                    }
                });
                if(existingCourse === null) {
                    user.courses = [...user.courses, courseToAdd];
                } else {
                    return Util.error(`You have already registered for ${courseToAdd.code}`, next);
                }
            }
        }
        await user.save();
        return res.redirect('/courses');
    });

    app.post('/student/dropCourse', async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        var existingCourse = null;
        for(key in req.body) {
            if(req.body[key] === 'on') {
                const courseToAdd = await Course.findById(key);
                user.courses.forEach(course => {
                    if(String(course._id) === String(key)) {
                        existingCourse = course;
                    }
                });
                if(existingCourse === null) {
                    return Util.error(`${courseToAdd.code} was not found among your registered courses`, next);
                } else {
                    user.courses = user.courses.filter(item => {
                        return String(item._id) !== String(key);
                    });
                }
            }
        }
        await user.save();
        return res.redirect('/courses');
    });

    app.get('/student/grades', requiresLogin, async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        return res. render('grades', { user });
    });
    
};