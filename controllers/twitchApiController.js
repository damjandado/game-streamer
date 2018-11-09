const axios = require("axios");
const twitchClientID = require("../config/keys").twitchClientID;
const {
  flatten,
  count_items,
  sortProperties,
  remove_duplicates_es6
} = require("./helpers.js");

exports.featuredApi = async (limit = 8) => {
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

exports.topGamesApi = async (limit = 8) => {
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

exports.fetchBroadcasters = async list => {
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
            // const findGamebyID = await axios({
            //   method: 'get',
            //   url: `https://api.twitch.tv/helix/games?id=${user.game_id}`,
            //   headers: { 'Client-ID': twitchClientID }
            // });
            const streamInfo = await axios({
              method: "get",
              url: `https://api.twitch.tv/kraken/streams/${user.user_id}`,
              headers: {
                "Client-ID": twitchClientID,
                Accept: "application/vnd.twitchtv.v5+json"
              }
            });
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
    outputBroadcasters = [].concat(result);
  });
  return outputBroadcasters;
};

exports.fetchGameStreams = async list => {
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
};

exports.fetchGames = async list => {
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
};

exports.processQuery = (user, prop, count) => {
  const select = user[0].visits[prop];

  const countObj = count_items(select);
  let mostVisited = sortProperties(countObj);
  mostVisited = mostVisited.slice(0, count);

  let recent = remove_duplicates_es6(select);
  recent = recent.slice(recent.length - count + 1);

  let joined = mostVisited.concat(recent);
  return remove_duplicates_es6(joined);
};
