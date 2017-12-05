import axios from 'axios';
import twitchAPI from '../config/keys';
import { FETCH_USER } from './types';

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

export const requestApi = () => dispatch => {
  //API request
  axios
    .get(
      `https://api.twitch.tv/kraken/streams/featured?&client_id=${twitchAPI}`
    )
    .then(response => {
      const streams = response.data.featured.map(function(feat) {
        return feat.stream;
      });
      //dispatch FetchSuccess, order 2
      dispatch(fetchSuccess(streams));
    })
    .catch(e => {
      //dispatch FetchFailure, order 3
      dispatch(fetchFailure(e));
    });

  //dispatch FetchRequest, order 1
  dispatch(fetchRequest());
};
