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
};
