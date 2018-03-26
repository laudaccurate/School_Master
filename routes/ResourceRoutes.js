
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Resource = mongoose.model('Resource');
const { isLecturer, requiresLogin } = require('../middleware');
const Util = require('../util');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "store"));
    }
});
  
const upload = multer({ storage });

module.exports = app => {
    app.param('id', async (req, res, next, id) => {
        try {
            const resource = await Resource.findById(id);
            req.file = resource;
            next();
        } catch (error) {
            return Util.error(error.message, next, error.status);
        }
    });

    app.get('/resources', async (req, res, next) => {
        const resources = await Resource.find();
        return res.render('resource', { resources });
    });

    app.get('/resources/upload', requiresLogin, isLecturer, (req, res, next) => {
        return res.render('upload');
    });

    app.post('/resources/upload', isLecturer, upload.single('file'), async (req, res, next) => {
        try {
            const resource = await Resource.create({
                _user: req.session.email,
                name: req.file.originalname,
                path: req.file.filename
            });
            return res.redirect('/resources');
        } catch (error) {
            return Util.error(error.message, next);
        }
    });

    app.get('/resources/:id/download', requiresLogin, (req, res, next) => {
        return res.sendFile(path.resolve(__dirname, '..', 'store', req.file.path));
    });
};