import axios from "axios";
import twitchAPI from "../config/keys";
import * as actions from "./actions";
import { FETCH_USER } from "./types";

export const featuredApi = () => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&client_id=${twitchAPI}`
  );
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchRequest());
  try {
    const streams = res.data.featured.map(function(feat) {
      return feat.stream;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchSuccess(streams));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchFailure(e));
  }
};

export const topGamesApi = () => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchAPI}`
  );
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchTopRequest());
  try {
    const games = res.data.top.map(function(feat) {
      return feat.game;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchTopSuccess(games));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchTopFailure(e));
  }
};

export const searchGamesApi = ({ search }) => async dispatch => {
  console.log('SEARCH term is', search);
  //API request
  const resGames = await axios.get(
    `https://api.twitch.tv/kraken/streams/?game=${search}&client_id=${twitchAPI}`
  );
  const resUsers = await axios({
    method: "get",
    url: `https://api.twitch.tv/helix/users?&login=${search}`,
    headers: { "Client-ID": twitchAPI }
  });
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchSearchRequest());
  try {
    const games = resGames.data.streams.map(function(feat) {
      return feat;
    });
    const users = resUsers.data.data.map(function(feat) {
      console.log('SEARCH', search);
      console.log('USER', feat);
      return feat;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchSearchSuccess(users, games));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchSearchFailure(e));
  }
};