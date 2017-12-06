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
  app.get(
    '/auth/twitchtv',
    passport.authenticate('twitchtv', {
      scope: ['user:edit', 'user:read:email']
    })
  );
  app.get(
    '/auth/twitchtv/callback',
    passport.authenticate('twitchtv'),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
