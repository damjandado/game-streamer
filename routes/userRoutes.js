// const _ = require('lodash');
// const Path = require('path-parser');
const axios = require("axios");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const twitchClientID = require("../config/keys").twitchClientID;

const User = mongoose.model("users");
const Game = mongoose.model("games");

module.exports = app => {
  app.get("/api/users", requireLogin, async (req, res) => {
    const users = await User.find({ _id: req.user.id });
    console.log("req.user: ", req.user);

    res.send(users);
  });

  app.get("/api/games", requireLogin, async (req, res) => {
    const userInDB = await User.find({ _id: req.user.id });
    const userdata = userInDB[0];
    let g = userdata.visits.games;
    g = remove_duplicates_es6(g);
    const games = g.map(item => encodeURI(item));
    const twGames = await fetchGames(games);
    console.log(twGames);
    console.log("TYPEOF twGames", typeof twGames);
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

    console.log("req: ", req.user);
  });

  app.post("/api/users", requireLogin, async (req, res) => {
    const obj = req.body.stream || req.body;
    const game = obj.game;
    const broadcaster = obj.channel.display_name;
    const userInDB = await User.find({ _id: req.user.id });
    const userdata = userInDB[0];
    userdata.visits.games.push(game);
    userdata.visits.users.push(broadcaster);

    console.log("BODY", req.body);
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

  app.get("/api/dashboard", requireLogin, async (req, res) => {
    console.log("Backend responds");
    let outputBroadcasters, outputGames;
    const user = await User.find({ _id: req.user.id });
    if (user[0].visits) {
      if (user[0].visits.users.length && user[0].visits.users.length < 4) {
        const broadcasters = processQuery(
          user,
          "users",
          user[0].visits.users.length
        );
        outputBroadcasters = await fetchBroadcasters(broadcasters);
      } else if (user[0].visits.users.length >= 4) {
        const broadcasters = processQuery(user, "users", 4);
        outputBroadcasters = await fetchBroadcasters(broadcasters);
      } else {
        const broadcasters = await featuredApi();
        outputBroadcasters = await fetchBroadcasters(broadcasters);
        console.log("listBroadcasters", outputBroadcasters);
      }
      if (user[0].visits.games.length && user[0].visits.games.length == 1) {
        const games = processQuery(user, "games", 1);
        outputGames = await fetchGameStreams(games);
        console.log('FIRST GAMES IF');
      } else if (user[0].visits.games.length >= 2) {
        const games = processQuery(
          user,
          "games",
          2
        );
        outputGames = await fetchGameStreams(games);
        console.log('SECOND GAMES IF');
      } else {
        const games = await topGamesApi();
        outputGames = await fetchGameStreams(games);
        console.log('THIRD GAMES IF');
        console.log('games', games);
      }
      const obj = {
        broadcasters: outputBroadcasters,
        games: outputGames
      };
      console.log("res.send(OBJ)", obj);
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
};

async function fetchBroadcasters(list) {
  const broadcasters = list;
  let outputBroadcasters;
  await Promise.all(
    broadcasters.map(async item => {
      try {
        const fetched = await axios({
          method: "get",
          url: `https://api.twitch.tv/helix/streams?user_login=${item}`,
          headers: { "Client-ID": twitchClientID }
        });
        if (fetched.data.data.length) {
          let user = fetched.data.data[0];
          let thumb = user.thumbnail_url.replace("{width}x{height}", "320x180");
          try {
            const findGamebyID = await axios({
              method: "get",
              url: `https://api.twitch.tv/helix/games?id=${user.game_id}`,
              headers: { "Client-ID": twitchClientID }
            });
            const gameName = findGamebyID.data.data[0].name;
            let parsed = Object.assign({}, user, {
              display_name: item,
              name: item,
              game: gameName,
              channel: {},
              thumbnail_url: thumb
            });
            return parsed;
          } catch (e) {
            console.log(e);
          }
        }
        return null;
      } catch (e) {
        console.log(e);
      }
    })
  ).then(result => {
    outputBroadcasters = [].concat(result);
  });
  return outputBroadcasters;
}

async function fetchGameStreams(list) {
  const games = list;
  let outputGames;
  await Promise.all(
    games.map(async item => {
      const fetched = await axios.get(
        `https://api.twitch.tv/kraken/streams/?game=${item}&client_id=${twitchClientID}`
      );
      let streams = fetched.data.streams;
      return [streams[0], streams[1]];
    })
  ).then(result => {
    const flattened = flatten(result);
    outputGames = [].concat(flattened);
  });
  return outputGames;
}

async function fetchGames(list) {
  const games = list;
  let outputGames;
  await Promise.all(
    games.map(async item => {
      try {
        const fetched = await axios({
          method: "get",
          url: `https://api.twitch.tv/helix/games?name=${item}`,
          headers: { "Client-ID": twitchClientID }
        });
        let game = fetched.data.data[0];
        return game;
      } catch (e) {
        console.log(e);
      }
    })
  ).then(result => {
    outputGames = [].concat(result);
  });
  return outputGames;
}

let processQuery = (user, prop, count) => {
  const select = user[0].visits[prop];

  const countObj = count_items(select);
  let mostVisited = sortProperties(countObj);
  mostVisited = mostVisited.slice(0, count);

  let recent = remove_duplicates_es6(select);
  recent = recent.slice(recent.length - count + 1);

  let joined = mostVisited.concat(recent);
  return remove_duplicates_es6(joined);
};

function flatten(arr) {
  return [].concat(...arr);
}

function remove_duplicates_es6(arr) {
  let s = new Set(arr);
  let it = s.values();
  return Array.from(it);
}

function count_items(arr) {
  return arr.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
}

function sortProperties(obj) {
  // convert object into array
  let sortable = [];
  for (let key in obj)
    if (obj.hasOwnProperty(key)) sortable.push([key, obj[key]]); // each item is an array in format [key, value]

  // sort items by value
  sortable.sort(function(a, b) {
    return b[1] - a[1]; // compare numbers
  });
  sortable = sortable.map(item => item[0]);
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

const featuredApi = async (limit = 8) => {
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=${limit}&client_id=${twitchClientID}`
  );
  try {
    const featured = res.data.featured.map(function(feat) {
      return feat.stream.channel.name;
    });
    return featured;
  } catch (e) {
    console.log(e);
  }
};

const topGamesApi = async (limit = 8) => {
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchClientID}&limit=${limit}`
  );
  try {
    const games = res.data.top.map(function(feat) {
      return feat.game.name;
    });
    return games;
  } catch (e) {
    console.log(e);
  }
};
