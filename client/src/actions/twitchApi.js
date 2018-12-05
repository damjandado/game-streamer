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
    const { featured } = res.data;
    const status = featured.length ? 'found_streams' : 'not_found';
    const payload = { status, list: featured };
    dispatch({ type: types.FETCH_FEATURED_SUCCESS, payload });
  } catch (e) {
    dispatch(actions.fetchFailure(e));
  }
};

export const topGamesApi = (
  limit = 10,
  offset = 0,
  searchTerm
) => async dispatch => {
  dispatch(actions.fetchTopRequest());
  try {
    const res = await axios.get(
      `https://api.twitch.tv/kraken/games/top?client_id=${twitchId}&limit=${limit}&offset=${offset}`
    );
    const { top } = res.data;
    if (!searchTerm) {
      dispatch(actions.fetchTopSuccess(top));
    } else {
      const term = searchTerm.toLowerCase();
      const games = top.filter(item => {
        const { name } = item.game;
        const arr = name.toLowerCase().split(' ');
        return arr.includes(term);
      });
      const status = games.length ? 'found_games' : 'not_found';
      dispatch({ type: 'SEARCH_GAMES', payload: { games, status } });
    }
  } catch (e) {
    dispatch(actions.fetchTopFailure(e));
  }
};

export const searchGamesApi = ({ search }, history) => async dispatch => {
  let payload = { term: search, status: 'loading', streams: [] };
  dispatch({ type: types.FETCH_SEARCH_REQUEST, payload }); 
  history.push('/search');
  const url = `https://api.twitch.tv/kraken/streams/?game=${search}&client_id=${twitchId}`;
  try {
    const res = await axios.get(url);
    const { streams } = res.data;
    const status = streams.length ? 'found_streams' : 'not_found';
    payload = { status, streams };
    dispatch({ type: types.FETCH_SEARCH_SUCCESS, payload });
  } catch (e) {
    payload = { status: 'error', error: e };
    dispatch({ type: types.FETCH_SEARCH_FAILURE, payload });
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
    dispatch({ type: types.FETCH_DASHBOARD, status: 'success' });
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
