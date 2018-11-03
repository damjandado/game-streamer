import axios from "axios";
import twitchId from "../config/keys";
import * as actions from "./actions";
import * as types from "./types";

export const featuredApi = (limit = 20) => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=${limit}&client_id=${twitchId}`
  );
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchRequest());
  try {
    const streams = res.data.featured.map(function(feat) {
      return feat;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchSuccess(streams));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchFailure(e));
  }
};

export const topGamesApi = (limit = 10, offset = 0) => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchId}&limit=${limit}`
  );
  let top = res.data.top;
  if (offset) {
    const resO = await axios.get(
      `https://api.twitch.tv/kraken/games/top?client_id=${twitchId}&limit=${limit}&offset=${offset}`
    );
    top = top.concat(resO.data.top);
  }
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchTopRequest());
  try {
    const games = top.map(function(feat) {
      return feat;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchTopSuccess(games));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchTopFailure(e));
  }
};

export const searchGamesApi = ({ search }, history) => async dispatch => {
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchSearchRequest(search));
  history.push("/search");
  //API request
  const resGames = await axios.get(
    `https://api.twitch.tv/kraken/streams/?game=${search}&client_id=${twitchId}`
  );
  const resUsers = /[: ]/.test(search)
    ? null
    : await axios({
        method: "get",
        url: `https://api.twitch.tv/helix/users?&login=${search}`,
        headers: { "Client-ID": twitchId }
      });
  try {
    const games = resGames.data.streams.map(function(feat) {
      return feat;
    });
    const users = resUsers
      ? resUsers.data.data.map(function(feat) {
          return feat;
        })
      : [];
    dispatch(actions.fetchSearchSuccess(users, games));
  } catch (e) {
    dispatch(actions.fetchSearchFailure(e));
  }
};

export const populateDashboard = () => async dispatch => {
  const res = await axios.get("/api/twitch/dashboard");
  dispatch({ type: types.FETCH_DASHBOARD, status: "loading" });
  try {
    dispatch({
      type: types.FETCH_BROADCASTERS,
      status: "success",
      payload: res.data.broadcasters
    });
    dispatch({
      type: types.FETCH_GAMES,
      status: "success",
      payload: res.data.games
    });
    dispatch(statusDashboard("success"));
  } catch (e) {
    dispatch({
      type: types.FETCH_DASHBOARD_FAILURE,
      status: "error",
      error: e
    });
  }
};

export const statusDashboard = status => {
  return {
    type: types.FETCH_DASHBOARD,
    status
  };
};

export const fetchClips = (
  channel = "Twitch",
  limit = 10
) => async dispatch => {
  const res = await axios({
    method: "get",
    url: `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=week&limit=${limit}`,
    headers: {
      "Client-ID": twitchId,
      Accept: "application/vnd.twitchtv.v5+json"
    }
  });

  dispatch({
    type: types.FETCH_CLIPS,
    status: "success",
    clips: res.data.clips
  });
};

export const fetchStreamAndClips = (
  channel = "Twitch",
  limit = 2
) => async dispatch => {
  const stream = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=5&client_id=${twitchId}`
  );
  const clips = await axios({
    method: "get",
    url: `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=week&limit=${limit}`,
    headers: {
      "Client-ID": twitchId,
      Accept: "application/vnd.twitchtv.v5+json"
    }
  });

  dispatch({
    type: types.FETCH_FEATURED_SUCCESS,
    status: "success",
    featured: stream.data.featured
  });
  dispatch({
    type: types.FETCH_CLIPS,
    status: "success",
    clips: clips.data.clips
  });
};

export const fetchChannelStream = id => async dispatch => {
  const res = await axios({
    method: "get",
    url: `https://api.twitch.tv/kraken/channels/${id}`,
    headers: {
      "Client-ID": `${twitchId}`,
      Accept: "application/vnd.twitchtv.v5+json"
    }
  });
  try {
    const stream = res.data;
    dispatch(actions.embedStream(stream));
  } catch (e) {
    dispatch(actions.fetchFailure(e));
  }
};

export const fetchStreamByChannelName = name => async dispatch => {
  try {
    const res = await axios({
      method: "get",
      url: `https://api.twitch.tv/kraken/channels/${name}`,
      headers: {
        "Client-ID": `${twitchId}`
      }
    });
    const stream = res.data;
    dispatch(actions.embedStream(stream));
  } catch (e) {
    console.log("404 where do you think you are going...");
    dispatch({ type: types.NOT_FOUND, found: false });
  }
};
