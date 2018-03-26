const mongoose = require('mongoose');

mongoose.model('Course', require('./Course'));
mongoose.model('Mail', require('./Mail'));
mongoose.model('User', require('./User'));
mongoose.model('Resource', require('./Resource'));
mongoose.model('Token', require('./Token'));
