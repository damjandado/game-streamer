// const _ = require('lodash');
// const Path = require('path-parser');
const axios = require('axios');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const twitchClientID = require('../config/keys').twitchClientID;

const User = mongoose.model('users');
const Game = mongoose.model('games');

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
    const user = await User.find({ _id: req.user.id });
    const selectedB = user[0].visits.users;
    const selectedG = user[0].visits.games;
    const broadcasters = selectedB.slice(2, 9);
    const games = selectedG.slice(0, 4);
    console.log('BROADCASTERS', broadcasters);
    let outputBroadcasters = await fetchBroadcasters(broadcasters);
    let outputGames = await fetchGameStreams(games);
    const obj = {
      broadcasters: outputBroadcasters,
      games: outputGames
    };
    console.log(obj);
    res.send(obj);
  });
};

async function fetchBroadcasters(obj) {
  const broadcasters = obj;
  let outputBroadcasters;
  await Promise.all(
    broadcasters.map(async item => {
      try {
        const fetched = await axios({
          method: 'get',
          url: `https://api.twitch.tv/helix/streams?user_login=${item}`,
          headers: { 'Client-ID': twitchClientID }
        });
        if (fetched.data.data.length) {
          let user = fetched.data.data[0];
          let thumb = user.thumbnail_url.replace('{width}x{height}', '320x180');
          try {
            const findGamebyID = await axios({
              method: 'get',
              url: `https://api.twitch.tv/helix/games?id=${user.game_id}`,
              headers: { 'Client-ID': twitchClientID }
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

async function fetchGameStreams(obj) {
  const games = obj;
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

async function fetchGames(obj) {
  const games = obj;
  let outputGames;
  await Promise.all(
    games.map(async item => {
      try {
        const fetched = await axios({
          method: 'get',
          url: `https://api.twitch.tv/helix/games?name=${item}`,
          headers: { 'Client-ID': twitchClientID }
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

function flatten(arr) {
  return [].concat(...arr);
}

function remove_duplicates_es6(arr) {
  let s = new Set(arr);
  let it = s.values();
  return Array.from(it);
}
