import axios from 'axios';
import map from 'async/map';
import async from 'async';
import twitchAPI from '../config/keys';
import * as actions from './actions';
import {
  FETCH_USER,
  FETCH_DASHBOARD,
  FETCH_BROADCASTERS,
  FETCH_GAMES,
  FETCH_DASHBOARD_FAILURE
} from './types';

export const featuredApi = () => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&client_id=${twitchAPI}`
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

export const topGamesApi = () => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchAPI}`
  );
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchTopRequest());
  try {
    const games = res.data.top.map(function(feat) {
      return feat;
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
    method: 'get',
    url: `https://api.twitch.tv/helix/users?&login=${search}`,
    headers: { 'Client-ID': twitchAPI }
  });
  //dispatch FetchRequest, order 1
  dispatch(actions.fetchSearchRequest());
  try {
    const games = resGames.data.streams.map(function(feat) {
      return feat;
    });
    const users = resUsers.data.data.map(function(feat) {
      return feat;
    });
    //dispatch FetchSuccess, order 2
    dispatch(actions.fetchSearchSuccess(users, games));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(actions.fetchSearchFailure(e));
  }
};

export const populateDashboard = () => async dispatch => {
  const res = await axios.get('/api/dashboard');
  console.log('Backend call already issued');
  dispatch({ type: FETCH_DASHBOARD, status: 'loading' });
  try {
    fetchBroadcasters(res, dispatch);
    fetchGames(res, dispatch);
  } catch (e) {
    dispatch({ type: FETCH_DASHBOARD_FAILURE, status: 'error', error: e });
  }
};

async function fetchBroadcasters(res, dispatch) {
  const { broadcasters } = res.data;
  console.log('res.data', res.data);
  Promise.all(
    broadcasters.map(async item => {
      try {
        const fetched = await axios({
          method: 'get',
          url: `https://api.twitch.tv/helix/streams?user_login=${item}`,
          headers: { 'Client-ID': twitchAPI }
        });
        console.log('const fetched', fetched);
        if (fetched.data.data.length) {
          let user = fetched.data.data[0];
          let thumb = user.thumbnail_url.replace('{width}x{height}', '320x180');
          let parsed = Object.assign({}, user, {
            display_name: item,
            name: item,
            channel: {},
            thumbnail_url: thumb
          });
          return parsed;
        }
        return null;
      } catch (e) {
        console.log(e);
      }
    })
  ).then(result =>
    dispatch({ type: FETCH_BROADCASTERS, status: 'success', payload: result })
  );
}

function fetchGames(res, dispatch) {
  const { games } = res.data;
  Promise.all(
    games.map(async item => {
      const fetched = await axios({
        method: 'get',
        url: `https://api.twitch.tv/kraken/streams/?game=${item}&client_id=${twitchAPI}`,
        headers: { 'Client-ID': twitchAPI }
      });
      let streams = fetched.data.streams;
      return [streams[0], streams[1]];
    })
  ).then(result => {
    console.log(result);
    const flattened = flatten(result);
    dispatch({ type: FETCH_GAMES, status: 'success', payload: flattened });
  });
}

function flatten(arr) {
  return [].concat(...arr);
}
