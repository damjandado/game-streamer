import axios from 'axios';
import twitchId from '../config/keys';
import * as actions from './actions';
import * as types from './types';

export const featuredApi = (limit = 20) => async dispatch => {
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?limit=${limit}&client_id=${twitchId}`
  );
  dispatch(actions.fetchRequest());
  try {
    const streams = res.data.featured.map(feat => feat);
    dispatch(actions.fetchSuccess(streams));
  } catch (e) {
    dispatch(actions.fetchFailure(e));
  }
};

export const topGamesApi = (
  limit = 10,
  offset = 0,
  searchTerm
) => async dispatch => {
  const res = await axios.get(
    `https://api.twitch.tv/kraken/games/top?client_id=${twitchId}&limit=${limit}&offset=${offset}`
  );
  const { top } = res.data;
  dispatch(actions.fetchTopRequest());
  try {
    const games = top.map(feat => feat);
    if (!searchTerm) {
      dispatch(actions.fetchTopSuccess(games));
    } else {
      const term = searchTerm.toLowerCase();
      const foundGames = games.filter(item => {
        const { name } = item.game;
        const arr = name.toLowerCase().split(' ');
        return arr.includes(term);
      });
      const status = foundGames.length ? 'found' : '';
      dispatch({ type: 'SEARCH_GAMES', payload: { foundGames, status } });
    }
  } catch (e) {
    dispatch(actions.fetchTopFailure(e));
  }
};

export const searchGamesApi = ({ search }, history) => async dispatch => {
  dispatch({ type: types.FETCH_SEARCH_REQUEST, term: search, status: 'loading' });
  history.push('/search');
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/?game=${search}&client_id=${twitchId}`
  );
  try {
    const games = res.data.streams.map(feat => feat);
    dispatch({ type: types.FETCH_SEARCH_SUCCESS, status: 'success', games });
  } catch (e) {
    dispatch({ type: types.FETCH_SEARCH_FAILURE, status: 'error', error: e });
  }
};

export const populateDashboard = () => async dispatch => {
  const res = await axios.get('/api/twitch/dashboard');
  dispatch({ type: types.FETCH_DASHBOARD, status: 'loading' });
  try {
    dispatch({
      type: types.FETCH_BROADCASTERS,
      status: 'success',
      payload: res.data.broadcasters
    });
    dispatch({
      type: types.FETCH_GAMES,
      status: 'success',
      payload: res.data.games
    });
    dispatch({ type: types.FETCH_DASHBOARD, status: 'success'});
  } catch (e) {
    dispatch({
      type: types.FETCH_DASHBOARD_FAILURE,
      status: 'error',
      error: e
    });
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
      'Client-ID': twitchId,
      Accept: 'application/vnd.twitchtv.v5+json'
    }
  });
  dispatch({
    type: types.FETCH_CLIPS,
    status: 'success',
    clips: res.data.clips
  });
};

export const fetchStreamAndClips = (
  channel = 'Twitch',
  limit = 2
) => async dispatch => {
  const stream = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&limit=5&client_id=${twitchId}`
  );
  dispatch({
    type: types.FETCH_FEATURED_SUCCESS,
    status: 'success',
    featured: stream.data.featured
  });
  fetchClips(channel, limit);
};

export const fetchChannelStream = id => async dispatch => {
  const res = await axios({
    method: 'get',
    url: `https://api.twitch.tv/kraken/channels/${id}`,
    headers: {
      'Client-ID': `${twitchId}`,
      Accept: 'application/vnd.twitchtv.v5+json'
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
      method: 'get',
      url: `https://api.twitch.tv/kraken/channels/${name}`,
      headers: {
        'Client-ID': `${twitchId}`
      }
    });
    const stream = res.data;
    dispatch(actions.embedStream(stream));
  } catch (e) {
    dispatch({ type: types.NOT_FOUND, found: false });
  }
};
