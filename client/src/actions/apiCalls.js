import axios from 'axios';
import twitchAPI from '../config/keys';
import * as actions from './actions';
import {
  FETCH_USER,
  FETCH_FEATURED_SUCCESS,
  FETCH_DASHBOARD,
  FETCH_BROADCASTERS,
  FETCH_GAMES,
  FETCH_DASHBOARD_FAILURE,
  FETCH_CLIPS
} from './types';

export const featuredApi = (limit = 20) => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=${limit}&client_id=${twitchAPI}`
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

export const topGamesApi = (limit = 10) => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchAPI}&limit=${limit}`
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
    dispatch({
      type: FETCH_BROADCASTERS,
      status: 'success',
      payload: res.data.broadcasters
    });
    dispatch({ type: FETCH_GAMES, status: 'success', payload: res.data.games });
  } catch (e) {
    dispatch({ type: FETCH_DASHBOARD_FAILURE, status: 'error', error: e });
  }
};

export const fetchClips = (
  channel = 'Twitch',
  limit = 10
) => async dispatch => {
  const res = await axios({
    method: 'get',
    url: `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=week&limit=${limit}`,
    headers: {
      'Client-ID': twitchAPI,
      Accept: 'application/vnd.twitchtv.v5+json'
    }
  });

  dispatch({ type: FETCH_CLIPS, status: 'success', clips: res.data.clips });
};

export const fetchStreamAndClips = (
  channel = 'Twitch',
  limit = 4
) => async dispatch => {
  const stream = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=5&client_id=${twitchAPI}`
  );
  const clips = await axios({
    method: 'get',
    url: `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=week&limit=${limit}`,
    headers: {
      'Client-ID': twitchAPI,
      Accept: 'application/vnd.twitchtv.v5+json'
    }
  });

  dispatch({
    type: FETCH_FEATURED_SUCCESS,
    status: 'success',
    featured: stream.data.featured
  });
  dispatch({ type: FETCH_CLIPS, status: 'success', clips: clips.data.clips });
};
