const requireLogin = require("../middlewares/requireLogin");
const localAuthController = require("../controllers/localAuthController");
const userController = require("../controllers/userController");
const userSettingsController = require("../controllers/userSettingsController");

module.exports = app => {
  app.post("/local/login", localAuthController.login);
  app.post("/local/signup", localAuthController.signup);
  app.get("/api/logout", localAuthController.logout);
  app.post("/api/users/webhooks", localAuthController.sgWebhooks);
  app.post("/api/users/userid", localAuthController.findByUserId);
  app.post("/api/send_email", localAuthController.sendgrid);
  app.get("/api/password_recovery/:formId", localAuthController.sgLink);

  app.post("/api/check_email", userSettingsController.checkEmail);
  app.post("/api/check_username", userSettingsController.checkUsername);
  app.post("/api/change_pass", userSettingsController.changePass);
  app.post("/api/compare_pass", userSettingsController.comparePass);
  app.get("/api/current_user", userSettingsController.currentUser);
  app.get("/api/current_user_db", requireLogin, userSettingsController.currentUserDb);

  app.get("/api/twitch/games", requireLogin, userController.games);
  app.post("/api/twitch/users", requireLogin, userController.users);
  app.get("/api/twitch/dashboard", requireLogin, userController.dashboard);

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
