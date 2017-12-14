// const _ = require('lodash');
// const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('./middlewares/requireLogin');

const User = mongoose.model('users');

module.exports = app => {
  app.get('/api/users', requireLogin, async (req, res) => {
    const users = await User.find({ _id: req.user.id });
    console.log('req.user: ', req.user);

    res.send(users);
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
    const user = await User.find({ _id: req.user.id });
    const broadcasters = user[0].visits.users;
    const games = user[0].visits.games;
    const selectedB = broadcasters.slice(0, 8);
    const selectedG = games.slice(0, 4);
    console.log('selectedB', selectedB);
    const obj = {
      broadcasters: selectedB,
      games: selectedG
    };
    console.log('obj', obj);
    res.send(obj);
  });
};
