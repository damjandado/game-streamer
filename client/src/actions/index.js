import axios from 'axios';
import twitchId from '../config/keys';
import { 
  FETCH_FEATURED,
  FETCH_TOPGAMES,
  FETCH_SEARCH,
  FETCH_DASHBOARD,
  FETCH_BROADCASTERS,
  FETCH_GAMES,
  FETCH_CLIPS,
  LOGIN_USER,
  FETCH_USER,
  SEND_MAIL,
  CHECK_MAIL,
  SAVE_ACTIVITY,
  TOGGLE_ACTIVE,
  EMBED_STREAM,
} from './types';

export const fetchUser = () => async dispatch => {
  axios.defaults.headers.common.Authorization = localStorage.getItem(
    'jwtToken'
  );
  const res = await axios.get('/api/current_user');
  dispatch({ type: LOGIN_USER });
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const sendMail = values => async dispatch => {
  const res = await axios.post("/api/send_email", values);
  try {
    if (res.data.success) {
      dispatch({ type: SEND_MAIL, userId: res.data.userId });
    }
  } catch (e) {
  }
};

export const checkEmail = email => async dispatch => {
  const res = await axios.post("/api/check_email", email);
  if (res.data.valid) {
    dispatch({ type: CHECK_MAIL, payload: true });
  } else {
    dispatch({ type: CHECK_MAIL, payload: false });
  }
};

export const saveActivity = entity => async dispatch => {
  const res = await axios.post("/api/twitch/users", entity);

  dispatch({ type: SAVE_ACTIVITY, payload: res.data });
};

export const toggleActive = tab => {
  return {
    type: TOGGLE_ACTIVE,
    tab
  };
};

export const embedStream = ebd => {
  return {
    type: EMBED_STREAM,
    ebd
  };
};

export const featuredApi = (limit = 20) => async dispatch => {
  const url = `https://api.twitch.tv/kraken/streams/featured?limit=${limit}&client_id=${twitchId}`;
  let payload = { status: 'loading', list: [] };
  dispatch({ type: FETCH_FEATURED, payload });
  try {
    const res = await axios.get(url);
    const { featured } = res.data;
    const status = featured.length ? 1 : 0;
    payload = { status, list: featured };
  } catch (e) {
    payload = { status: 'error' }
  }
  dispatch({ type: FETCH_FEATURED, payload });
};

export const topGamesApi = (
  limit = 10,
  offset = 0,
  searchTerm
) => async dispatch => {
  const url = `https://api.twitch.tv/kraken/games/top?client_id=${twitchId}&limit=${limit}&offset=${offset}`;
  let payload = { status: 'loading', list: [] };
  dispatch({ type: FETCH_TOPGAMES, payload });
  try {
    const res = await axios.get(url);
    const { top } = res.data;
    if (!searchTerm) {
      payload = { status: 1, list: top };
    } else {
        const term = searchTerm.toLowerCase();
        const list = top.filter(item => {
            const { name } = item.game;
            const arr = name.toLowerCase().split(' ');
            return arr.includes(term);
        });
        const status = list.length ? 1 : 0;
        payload = { games: list, status };
        dispatch({ type: FETCH_SEARCH, payload });
    }
  } catch (e) {
    payload = { ...payload, status: 'error' };
  }
  dispatch({ type: FETCH_TOPGAMES, payload });
};

export const searchGamesApi = ({ search }, history) => async dispatch => {
  let payload = { term: search, status: 'loading', streams: [] };
  dispatch({ type: FETCH_SEARCH, payload }); 
  history.push('/search');
  const url = `https://api.twitch.tv/kraken/streams/?game=${search}&client_id=${twitchId}`;
  try {
    const res = await axios.get(url);
    const { streams } = res.data;
    const status = streams.length ? 2 : 0;
    payload = { ...payload, status, streams };
    dispatch({ type: FETCH_SEARCH, payload });
  } catch (e) {
    payload = { status: 'error', error: e };
    dispatch({ type: FETCH_SEARCH, payload });
  }
};

export const populateDashboard = () => async dispatch => {
  const res = await axios.get('/api/twitch/dashboard');
  dispatch({ type: FETCH_DASHBOARD, status: 'loading' });
  try {
    dispatch({
      type: FETCH_BROADCASTERS,
      status: 'success',
      payload: res.data.broadcasters
    });
    dispatch({
      type: FETCH_GAMES,
      status: 'success',
      payload: res.data.games
    });
    dispatch({ type: FETCH_DASHBOARD, status: 'success' });
  } catch (e) {
    dispatch({
      type: FETCH_DASHBOARD,
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
    type: FETCH_CLIPS,
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
  let stream;
  try {
    stream = res.data;
  } catch (e) {
        
  }
  dispatch(embedStream(stream));
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
    dispatch(embedStream(stream));
  } catch (e) {
    dispatch({ type: 'NOT_FOUND', found: false });
  }
};
