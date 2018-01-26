import {withRouter} from "react-router-dom";
import axios from 'axios';
import * as types from './types';

export const onRegister = (values, history) => async dispatch => {
    dispatch(beginRegister());

    const res = await makeUserRequest('post', values, '/register');
    try {
      if (res.data.success) {
        dispatch(registerSuccess());
        const {email:logemail, password:logpassword} = values;
        dispatch(onSignIn({logemail, logpassword}, '/', history));
      } else {
        dispatch(registerError());
          let registerMessage = res.data.message;
          return registerMessage;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log('Error on registration:', e.message);
      }
    }
}

export const onSignIn = (values, path, history) => async dispatch => {
  console.log('values', values);
  console.log('path', path);
  console.log('history', history);
  dispatch(beginSignin());
  const res = await makeUserRequest('post', values, '/auth/local');
  try {
    if (res.data.success) {
      dispatch(signinSuccess(values));
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      history.push(path);
    } else {
      dispatch(signinError());
      let loginMessage = res.data.message;
      return loginMessage;
    }
  } catch (e) {
    console.log('Error', e.message);
  }
  // window.location = '/auth/local';
  // history.push('/');
};

export const onSignOut = history => async dispatch => {
  dispatch(beginSignout());
  const res = await axios.get('/api/logout');
  console.log('A P I logout', res);
  try {
    if (res.data.success) {
      dispatch(signoutSuccess());
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      history.push("/");
    } else {
      dispatch(signoutError());
    }
  } catch (e) {
    console.log('Error', res.message);
  }
};

function makeUserRequest(method, data, api = '/login') {
  // returns a Promise
  return axios({
    method: method,
    url: api,
    data: data
  });
}

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: types.FETCH_USER, payload: res.data });
};

// "Log In" action creators
function beginSignin() {
  return { type: types.SIGNIN_USER };
}

function signinSuccess(data) {
  return {
    type: types.SIGNIN_SUCCESS_USER,
    data
  };
}

function signinError() {
  return { type: types.SIGNIN_ERROR_USER };
}

// "Log Out" action creators
function beginSignout() {
  return { type: types.SIGNOUT_USER };
}

function signoutSuccess() {
  return { type: types.SIGNOUT_SUCCESS_USER };
}

function signoutError() {
  return { type: types.SIGNOUT_ERROR_USER };
}

// "Register" action creators
function beginRegister() {
  return { type: types.REGISTER_USER };
}

function registerSuccess() {
  return { type: types.REGISTER_SUCCESS_USER };
}

function registerError() {
  return { type: types.REGISTER_ERROR_USER };
}

// export function authError(error) {
//   return {
//     type: AUTH_ERROR,
//     payload: error
//   };
// }

export function fetchRequest() {
  return {
    type: types.FETCH_FEATURED_REQUEST,
    status: 'loading'
  };
}

export function fetchSuccess(featured) {
  return {
    type: types.FETCH_FEATURED_SUCCESS,
    status: 'success',
    featured
  };
}

export function fetchFailure(error) {
  return {
    type: types.FETCH_FEATURED_FAILURE,
    status: 'error',
    error
  };
}

export function fetchTopRequest() {
  return {
    type: types.FETCH_TOPGAMES_REQUEST,
    status: 'loading'
  };
}

export function fetchTopSuccess(streams) {
  return {
    type: types.FETCH_TOPGAMES_SUCCESS,
    status: 'success',
    streams
  };
}

export function fetchTopFailure(error) {
  return {
    type: types.FETCH_TOPGAMES_FAILURE,
    status: 'error',
    error
  };
}

export function fetchSearchRequest() {
  return {
    type: types.FETCH_SEARCH_REQUEST,
    status: 'loading'
  };
}

export function fetchSearchSuccess(users, games) {
  return {
    type: types.FETCH_SEARCH_SUCCESS,
    status: 'success',
    users,
    games
  };
}

export function fetchSearchFailure(error) {
  return {
    type: types.FETCH_SEARCH_FAILURE,
    status: 'error',
    error
  };
}

export const saveActivity = entity => async dispatch => {
  const res = await axios.post('/api/users', entity);

  dispatch({ type: types.SAVE_ACTIVITY, payload: res.data });
};

export const toggleActive = tab => {
  return {
    type: types.TOGGLE_ACTIVE,
    tab
  };
};

export const embedStream = ebd => {
  return {
    type: types.EMBED_STREAM,
    ebd
  };
};
