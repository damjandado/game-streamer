// const _ = require('lodash');
// const Path = require('path-parser');
const axios = require('axios');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const twitchClientID = require('../config/keys').twitchClientID;

const User = mongoose.model('users');
const Game = mongoose.model('games');

const {
  fetchBroadcasters,
  fetchGameStreams,
  processQuery,
  flatten,
  remove_duplicates_es6,
  count_items,
  sortProperties
} = require('./func.js');

module.exports = app => {
  app.get('/api/users', requireLogin, async (req, res) => {
    const users = await User.find({ _id: req.user.id });
    console.log('req.user: ', req.user);

    res.send(users);
  });

  app.get('/api/games', requireLogin, async (req, res) => {
    const userInDB = await User.find({ _id: req.user.id });
    const userdata = userInDB[0];
    let g = userdata.visits.games;
    g = remove_duplicates_es6(g);
    const games = g.map(item => encodeURI(item));
    const twGames = await fetchGames(games);
    console.log(twGames);
    console.log('TYPEOF twGames', typeof twGames);
    const listGames = new Game({
      games: twGames
    });
    console.log(listGames);
    try {
      const lg = await listGames.save();
      res.send(lg);
    } catch (err) {
      res.status(422).send(err);
    }

    console.log('req: ', req.user);
  });

  app.post('/api/users', requireLogin, async (req, res) => {
    const obj = req.body.stream || req.body;
    const game = obj.game;
    const broadcaster = obj.channel.display_name;
    const userInDB = await User.find({ _id: req.user.id });
    const userdata = userInDB[0];
    userdata.visits.games.push(game);
    userdata.visits.users.push(broadcaster);

    console.log('BODY', req.body);
    res.send(req.body);

    User.updateOne(
      {
        _id: req.user.id
      },
      {
        visits: {
          games: userdata.visits.games,
          users: userdata.visits.users
        }
      }
    ).exec();
  });

  app.get('/api/dashboard', requireLogin, async (req, res) => {
    console.log('Backend responds');
    let outputBroadcasters, outputGames;
    const user = await User.find({ _id: req.user.id });
    const vis = user[0].visits;
    if (vis) {
      if (vis.users.length && vis.users.length < 4) {
        const broadcasters = processQuery(user, 'users', vis.users.length);
        outputBroadcasters = await fetchBroadcasters(broadcasters);
      } else if (vis.users.length >= 4) {
        const broadcasters = processQuery(user, 'users', 4);
        outputBroadcasters = await fetchBroadcasters(broadcasters);
      } else {
        const broadcasters = await featuredApi();
        outputBroadcasters = await fetchBroadcasters(broadcasters);
      }
      if (vis.games.length && vis.games.length == 1) {
        const games = processQuery(user, 'games', 1);
        outputGames = await fetchGameStreams(games);
        console.log('FIRST GAMES IF');
      } else if (vis.games.length >= 2) {
        const games = processQuery(user, 'games', 2);
        outputGames = await fetchGameStreams(games);
        console.log('SECOND GAMES IF');
      } else {
        const games = await topGamesApi();
        outputGames = await fetchGameStreams(games);
        console.log('THIRD GAMES IF');
      }
      const obj = {
        broadcasters: outputBroadcasters,
        games: outputGames
      };
      console.log('res.send(OBJ)', obj);
      res.send(obj);
    } else {
      outputBroadcasters = await featuredApi();
      outputGames = await topGamesApi();
      const obj = {
        broadcasters: outputBroadcasters,
        games: outputGames
      };
      res.send(obj);
    }
  });

  app.post('/api/registration', async (req, res) => {
    console.log('req.body', req.body);
    const rb = req.body;

    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send('passwords dont match');
      return next(err);
    }

    if (
      req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf
    ) {
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf
      };

      User.create(userData, function(error, user) {
        console.log('User.create(userData, ...)');
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/auth/profile');
        }
      });
    } else if (req.body.logemail && req.body.logpassword) {
      console.log('req.session', req.session);
      console.log(
        'User.authenticate(req.body.logemail, req.body.logpassword, ...)'
      );
      User.authenticate(req.body.logemail, req.body.logpassword, function(
        error,
        user
      ) {
        console.log('error, user', user);
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          console.log('REDIRECTION HERE');
          console.log('req.body', req.body);
          return res.send(user);
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  });

  // GET route after registering
  app.get('/auth/profile', function(req, res, next) {
    console.log('app.get(/auth/profile...');
    User.findById(req.session.userId).exec(function(error, user) {
      console.log('req.session -+-+-+-+-', req.session);
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.redirect('/');
        }
      }
    });
  });
};
