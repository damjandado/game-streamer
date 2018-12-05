const axios = require("axios");
const twitchClientID = require("../config/keys").twitchClientID;
const {
  flatten,
  count_items,
  sortProperties,
  remove_duplicates,
} = require("./helpers.js");

const featuredApi = async (limit = 8) => {
  try {
    const { data } = await axios.get(
      `https://api.twitch.tv/kraken/streams/featured?&limit=${limit}&client_id=${twitchClientID}`
    );
    return data.featured.map(({ stream }) => stream);
  } catch (e) {
    return null;
  }
};

exports.topGamesApi = async (limit = 8) => {
  try {
    const { data } = await axios.get(
      `https://api.twitch.tv/kraken/games/top?client_id=${twitchClientID}&limit=${limit}`
    );
    return data.top.map(({ game }) => game.name);
  } catch (e) {
    return null;
  }
};

exports.fetchStreamInfo = async ({ user_id }) => {
  try {
    const { data } = await axios.get({
      url: `https://api.twitch.tv/kraken/streams/${user_id}`,
      headers: {
        "Client-ID": twitchClientID,
        "Accept": "application/vnd.twitchtv.v5+json",
      },
    });
    return data.stream;
  } catch (e) {
    return null;
  }
}

exports.fetchStreamsByUsers = async list => {
  let streamsByUsers;
  await Promise.all(
    list.map(async item => {
      try {
        const fetched = await axios.get({
          url: `https://api.twitch.tv/helix/streams?user_login=${item}`,
          headers: { "Client-ID": twitchClientID },
        });
        if (fetched.data.data.length) {
          let user = fetched.data.data[0];
          return await fetchStreamInfo(user);
        }
      } catch (e) {
        return null;
      }  
    })
  ).then(result => {
    streamsByUsers = [].concat(result);
  });
  streamsByUsers = streamsByUsers.filter(item => item !== null);
  if (!streamsByUsers.length) return featuredApi();
  return streamsByUsers;
};

exports.fetchStreamsByGames = async list => {
  let streamsByGames;
  await Promise.all(
    list.map(async item => {
      const fetched = await axios.get(
        `https://api.twitch.tv/kraken/streams/?game=${item}&client_id=${twitchClientID}`
      );
      let { streams } = fetched.data;
      return [streams[0], streams[1]];
    })
  ).then(result => {
    const flattened = flatten(result);
    streamsByGames = [].concat(flattened);
  });
  return streamsByGames;
};

exports.fetchGames = async list => {
  let outputGames;
  await Promise.all(
    list.map(async item => {
      try {
        const fetched = await axios.get({
          url: `https://api.twitch.tv/helix/games?name=${item}`,
          headers: { "Client-ID": twitchClientID }
        });
        return fetched.data.data[0];
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

  let recent = remove_duplicates(select);
  recent = recent.slice(recent.length - count);

  let joined = mostVisited.concat(recent);
  return remove_duplicates(joined);
};
