const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");

const User = mongoose.model("users");
const Game = mongoose.model("games");

const {
  featuredApi,
  topGamesApi,
  fetchGames,
  fetchBroadcasters,
  fetchGameStreams,
  processQuery,
} = require("./twitchApiController.js");

const {
  flatten,
  remove_duplicates_es6,
  count_items,
  sortProperties,
  makeid,
} = require('./helpers.js');

exports.games = async (req, res) => {
  const userInDB = await User.find({ _id: req.user.id });
  const userdata = userInDB[0];
  let g = userdata.visits.games;
  g = remove_duplicates_es6(g);
  const games = g.map(item => encodeURI(item));
  const twGames = await fetchGames(games);
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
};

exports.users = async (req, res) => {
  const obj = req.body.stream || req.body;
  const game = obj.game;
  const broadcaster = obj.channel.display_name;
  const userInDB = await User.find({ _id: req.user.id });
  const userdata = userInDB[0];
  userdata.visits.games.push(game);
  userdata.visits.users.push(broadcaster);

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
  let usersToFind, gamesToFind, users, games;
  const appUser = await User.find({ _id: req.user.id });
  const { visits } = appUser[0];
  if (visits) {
    if (visits.users.length && visits.users.length < 4) {
      usersToFind = processQuery(appUser, "users", visits.users.length);
    } else if (visits.users.length >= 4) {
      usersToFind = processQuery(appUser, "users", 4);
    } else {
      usersToFind = await featuredApi();
    }
    if (visits.games.length && visits.games.length == 1) {
      gamesToFind = processQuery(appUser, "games", 1);
    } else if (visits.games.length >= 2) {
      gamesToFind = processQuery(appUser, "games", 2);
    } else {
      gamesToFind = await topGamesApi();
    }
    users = fetchBroadcasters(usersToFind);
    games = fetchGameStreams(gamesToFind);
  } else {
    users = featuredApi();
    games = topGamesApi();
  }
  res.send({ broadcasters: await users, games: await games });
};
