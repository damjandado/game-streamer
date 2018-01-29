const axios = require('axios');
const twitchClientID = require('../config/keys').twitchClientID;

exports.makeid = num => {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < num; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

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

async function fetchBroadcasters(list) {
  const broadcasters = list;
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
          console.log('user -> api.twitch.tv/helix/streams?user_login=');
          console.log('***------------***');
          console.log(user);
          let thumb = user.thumbnail_url.replace('{width}x{height}', '320x180');
          try {
            // const findGamebyID = await axios({
            //   method: 'get',
            //   url: `https://api.twitch.tv/helix/games?id=${user.game_id}`,
            //   headers: { 'Client-ID': twitchClientID }
            // });
            // const gameName = findGamebyID.data.data[0].name;
            // let parsed = Object.assign({}, user, {
            //   display_name: item,
            //   name: item,
            //   game: gameName,
            //   channel: {},
            //   thumbnail_url: thumb
            // });
            const streamInfo = await axios({
              method: 'get',
              url: `https://api.twitch.tv/kraken/streams/${user.user_id}`,
              headers: {
                'Client-ID': twitchClientID,
                'Accept': 'application/vnd.twitchtv.v5+json'
              }
            });
            console.log('streamInfo.data ->');
            console.log(streamInfo.data.stream);
            return streamInfo.data.stream;
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
    console.log('outputBroadcasters');
    console.log('***------------***');
    console.log(result);
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

exports.featuredApi = featuredApi;
exports.topGamesApi = topGamesApi;
exports.fetchBroadcasters = fetchBroadcasters;
exports.fetchGameStreams = fetchGameStreams;

exports.processQuery = processQuery;
exports.flatten = flatten;
exports.remove_duplicates_es6 = remove_duplicates_es6;
exports.count_items = count_items;
exports.sortProperties = sortProperties;
