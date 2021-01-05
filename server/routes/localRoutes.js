const requireLogin = require('../middlewares/requireLogin');
const localAuthCtrl = require('../controllers/localAuthController');
const userCtrl = require('../controllers/userController');

module.exports = (app) => {
    app.post('/local/login', localAuthCtrl.login);
    app.post('/local/signup', localAuthCtrl.signup);
    app.get('/users/confirmation/:id', localAuthCtrl.confirmUser);
    app.get('/api/logout', localAuthCtrl.logout);
    app.post('/api/users/webhooks', localAuthCtrl.sgWebhooks);
    app.post('/api/users/:userid', localAuthCtrl.findByUserId);
    app.post('/api/send_email', localAuthCtrl.sendgrid);
    app.get('/api/password_recovery/:formId', localAuthCtrl.sgLink);

    app.post('/api/check_email', userCtrl.checkEmail);
    app.post('/api/check_username', userCtrl.checkUsername);
    app.post('/api/change_pass', userCtrl.changePass);
    app.post('/api/compare_pass', userCtrl.comparePass);
    app.get('/api/current_user', userCtrl.currentUser);
    app.get('/api/twitch/games', requireLogin, userCtrl.games);
    app.post('/api/twitch/users', requireLogin, userCtrl.users);
    app.get('/api/twitch/dashboard', requireLogin, userCtrl.dashboard);
    app.get('/api/current_user_db', requireLogin, userCtrl.currentUserDb);


    // app.post('/api/registration', async (req, res) => {
    //   if (req.body.logemail && req.body.logpassword) {
    //     console.log('req.session', req.session);
    //     await User.authenticate(req.body.logemail, req.body.logpassword, function(
    //       error,
    //       user
    //     ) {
    //       console.log('User.authenticate gives this back - ', user);
    //       if (error || !user) {
    //         var err = new Error('Wrong email or password.');
    //         err.status = 401;
    //         return next(err);
    //       } else {
    //         req.session.userId = user._id;
    //         res.send(user);
    //       }
    //     });
    //   } else {
    //     var err = new Error('All fields required.');
    //     err.status = 400;
    //     return next(err);
    //   }
    // });

    // GET route after registering
    // app.get('/auth/local', function(req, res, next) {
    //   User.findById(req.session.userId).exec(function(error, user) {
    //     console.log('req.user - ', req.user);
    //     if (error) {
    //       return next(error);
    //     } else {
    //       if (user === null) {
    //         var err = new Error('Not authorized! Go back!');
    //         err.status = 400;
    //         return next(err);
    //       } else {
    //         return res.send('user');
    //       }
    //     }
    //   });
    // });
};
