const mongoose = require('mongoose');
const { requiresLogin } = require('../middleware');
const Mail = mongoose.model('Mail');
const User = mongoose.model('User');
const Util = require('../util');

module.exports = app => {
    app.get('/mail', requiresLogin, async (req, res, next) => {
        var inbox = [];
        const mails = await Mail.find();
        mails.forEach( mail => {
          mail.recipients.forEach(recipient => {
            if(recipient === req.session.email) {
              inbox.push(mail);
            }
          });
        });
        const outbox = await Mail.find({sender: req.session.email});
        return res.render('mail', { inbox, outbox });
    });

    app.post('/lecturer/mail/:courseId', requiresLogin, async function(req, res, next) {
        const { text, recipients, sender } = req.body;
        var list = [];
        try{
            const students = await User.find({userType: 'student'});
            if(students) {
                students.forEach(async student => {
                    student.courses.forEach(async course => {
                      if(String(course._id) === req.params.courseId) {
                        list.push(student.email);
                        }
                    });
                });
                await Mail.create({
                  text,
                  recipients: list,
                  sender: req.session.email
                });
            } else{
              return Util.error('No students have registred for this course', next);
            }      
            return res.redirect('/mail');
        } catch(error) {
            return Util.error(error.message, next);
        }
    });

    app.get('/mail/compose', requiresLogin, async (req, res, next) => {
        const user = await User.findOne({email: req.session.email});
        return res. render('composeMail', { user });
    });

    app.post('/mail/compose', async (req, res, next) => {
        const recipients = [];
        const { text, recipient, sender } = req.body;

        if(!text || !recipient.trim()) {
            return Util.error('All fields required', next);
        }
        recipients.push(recipient);

        const mail = await Mail.create({ text, recipients, sender });
        return res.redirect('/mail');
    });
};