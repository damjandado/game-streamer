const passport = require('passport');

module.exports = app => {
  // Google auth
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/');
    }
  );
  
  // Twitch auth
  app.get('/auth/twitch', passport.authenticate('twitch'));
  app.get(
    '/auth/twitch/callback',
    passport.authenticate('twitch'),
    (req, res) => {
      res.redirect('/');
    }
  );

  // Local auth
  app.post(
    '/auth/localiii',
    passport.authenticate('local', { failureRedirect: '/loginj' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  // app.get('/api/logout', (req, res) => {
  //   req.logout();
  //   res.redirect('/');
  // });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
