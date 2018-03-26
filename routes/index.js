module.exports = app => {
    require('./AuthRoutes')(app);
    require('./UserRoutes')(app);
    require('./CourseRoutes')(app);
    require('./MailRoutes')(app);
    require('./MainRoutes')(app);
    require('./ResourceRoutes')(app);
};