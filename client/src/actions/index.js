import axios from 'axios';
import twitchAPI from '../config/keys';
import { FETCH_USER } from './types';

export const toggleActive = isActive => {
  const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';
  return {
    type: TOGGLE_ACTIVE,
    isActive
  };
};

export const embedStream = embeded => {
  const EMBED_STREAM = 'EMBED_STREAM';
  return {
    type: EMBED_STREAM,
    embeded
  };
};

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export function fetchSuccess(streams) {
  const FETCH_SUCCESS = 'FETCH_SUCCESS';
  return {
    type: FETCH_SUCCESS,
    status: 'success',
    streams
  };
}

export function fetchRequest() {
  const FETCH_REQUEST = 'FETCH_REQUEST';
  return {
    type: FETCH_REQUEST,
    status: 'loading'
  };
}

export function fetchFailure(error) {
  const FETCH_FAILURE = 'FETCH_FAILURE';
  return {
    type: FETCH_FAILURE,
    status: 'error',
    error
  };
}

export const requestApi = () => async dispatch => {
  //API request
  const res = await axios.get(
    `https://api.twitch.tv/kraken/streams/featured?&client_id=${twitchAPI}`
  );
  //dispatch FetchRequest, order 1
  dispatch(fetchRequest());
  try {
    const streams = res.data.featured.map(function(feat) {
      return feat.stream;
    });
    //dispatch FetchSuccess, order 2
    dispatch(fetchSuccess(streams));
  } catch (e) {
    //dispatch FetchSuccess, order 3
    dispatch(fetchFailure(e));
  }
};
