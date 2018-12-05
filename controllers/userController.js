const mongoose = require("mongoose");
const User = mongoose.model("users");
const Game = mongoose.model("games");

const {
  fetchGames,
  fetchStreamsByUsers,
  fetchStreamsByGames,
  processQuery,
} = require("./twitchApiController.js");

exports.games = async (req, res) => {
  const appUser = await User.findById(req.user.id).exec();
  let { games } = appUser.visits;
  let listOfGames = remove_duplicates(games);
  listOfGames = listOfGames.map(item => encodeURI(item));
  const gamesInstance = new Game({ games: await fetchGames(listOfGames) });
  console.log(gamesInstance);
  try {
    const lg = await gamesInstance.save();
    res.send(lg);
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.users = async (req, res) => {
  const obj = req.body.stream || req.body;
  const game = obj.game;
  const user = obj.channel.display_name;
  const appUser = await User.findById(req.user.id).exec();
  const { games, users } = appUser.visits;
  res.send(req.body);

  User.updateOne(
    {
      _id: req.user.id
    },
    {
      visits: {
        games: [ ...games, game ],
        users: [ ...users, user ],
      }
    }
  ).exec();
};

exports.dashboard = async (req, res) => {
  let listOfUsers = [], listOfGames = [], users, games;
  const appUser = await User.find({ _id: req.user.id });
  const { visits } = appUser[0];
  if (visits) {
    if (visits.users.length && visits.users.length < 4) {
      listOfUsers = processQuery(appUser, "users", visits.users.length);
    } else {
      listOfUsers = processQuery(appUser, "users", 4);
    }
    if (visits.games.length && visits.games.length == 1) {
      listOfGames = processQuery(appUser, "games", 1);
    } else {
      listOfGames = processQuery(appUser, "games", 2);
    }
  }
  users = fetchStreamsByUsers(listOfUsers);
  games = fetchStreamsByGames(listOfGames);
  res.send({ broadcasters: await users, games: await games });
};
