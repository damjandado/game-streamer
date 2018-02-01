const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');
const localFuncs = require('./localFuncs');

const User = mongoose.model('users');
const Game = mongoose.model('games');

const {
  featuredApi,
  topGamesApi,
  fetchBroadcasters,
  fetchGameStreams,
  processQuery,
  flatten,
  remove_duplicates_es6,
  count_items,
  sortProperties,
  makeid
} = require('./func.js');

exports.games = async (req, res) => {
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
};

exports.users = async (req, res) => {
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
};

exports.dashboard = async (req, res) => {
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
    // console.log('res.send(OBJ)', obj);
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
};
