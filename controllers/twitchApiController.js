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
    return res.data.featured.map(({ stream }) => stream.channel.name);
  } catch (e) {
    console.log(e);
  }
};

exports.topGamesApi = async (limit = 8) => {
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchClientID}&limit=${limit}`
  );
  try {
    return res.data.top.map(({ game }) => game.name);
  } catch (e) {
    console.log(e);
  }
};

exports.fetchBroadcasters = async list => {
  let broadcasters;
  await Promise.all(
    list.map(async item => {
      try {
        const fetched = await axios({
          method: "get",
          url: `https://api.twitch.tv/helix/streams?user_login=${item}`,
          headers: { "Client-ID": twitchClientID }
        });
        if (fetched.data.data.length) {
          let user = fetched.data.data[0];
          try {
            const streamInfo = await axios({
              method: "get",
              url: `https://api.twitch.tv/kraken/streams/${user.user_id}`,
              headers: {
                "Client-ID": twitchClientID,
                "Accept": "application/vnd.twitchtv.v5+json",
              }
            });
            return streamInfo.data.stream;
          } catch (e) {
            console.log(e);
            return null;
          }
        }
      } catch (e) {
        console.log(e);
        return null;
      }  
    })
  ).then(result => {
    broadcasters = [].concat(result);
  });
  return broadcasters;
};

exports.fetchGameStreams = async list => {
  let outputGames;
  await Promise.all(
    list.map(async item => {
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
  recent = recent.slice(recent.length - count);

  let joined = mostVisited.concat(recent);
  return remove_duplicates_es6(joined);
};
