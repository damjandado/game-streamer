// import { FETCH_USER, TOGGLE_ACTIVE, EMBED_STREAM, FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from './types';
import * as t from './types';
import axios from 'axios';

export const saveActivity = entity => async dispatch => {
  const res = await axios.post('/api/users', entity);

  dispatch({ type: t.SAVE_ACTIVITY, payload: res.data });
};

export const toggleActive = tab => {
  return {
    type: t.TOGGLE_ACTIVE,
    tab
  };
};

export const embedStream = ebd => {
  return {
    type: t.EMBED_STREAM,
    ebd
  };
};

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: t.FETCH_USER, payload: res.data });
};

export function fetchRequest() {
  return {
    type: t.FETCH_FEATURED_REQUEST,
    status: 'loading'
  };
}

export function fetchSuccess(featured) {
  return {
    type: t.FETCH_FEATURED_SUCCESS,
    status: 'success',
    featured
  };
}

export function fetchFailure(error) {
  return {
    type: t.FETCH_FEATURED_FAILURE,
    status: 'error',
    error
  };
}

export function fetchTopRequest() {
  return {
    type: t.FETCH_TOPGAMES_REQUEST,
    status: 'loading'
  };
}

export function fetchTopSuccess(streams) {
  return {
    type: t.FETCH_TOPGAMES_SUCCESS,
    status: 'success',
    streams
  };
}

export function fetchTopFailure(error) {
  return {
    type: t.FETCH_TOPGAMES_FAILURE,
    status: 'error',
    error
  };
}

export function fetchSearchRequest() {
  return {
    type: t.FETCH_SEARCH_REQUEST,
    status: 'loading'
  };
}

export function fetchSearchSuccess(users, games) {
  return {
    type: t.FETCH_SEARCH_SUCCESS,
    status: 'success',
    users,
    games
  };
}

export function fetchSearchFailure(error) {
  return {
    type: t.FETCH_SEARCH_FAILURE,
    status: 'error',
    error
  };
}
