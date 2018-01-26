import {
  FETCH_USER,
  SIGNIN_USER,
  SIGNIN_SUCCESS_USER,
  SIGNIN_ERROR_USER,
  SIGNUP_USER,
  SIGNUP_SUCCESS_USER,
  SIGNUP_ERROR_USER,
  SIGNOUT_USER,
  SIGNOUT_SUCCESS_USER,
  SIGNOUT_ERROR_USER,
  REGISTER_USER,
  REGISTER_SUCCESS_USER,
  REGISTER_ERROR_USER
} from '../actions/types';

const initialState = {
  isWaiting: false,
  authenticated: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const user = action.payload || email;
      console.log('u s e r ', user);
      return user
        ? Object.assign({}, state, {user}, { authenticated: true })
        : Object.assign({}, state, { authenticated: false });
    case SIGNIN_USER:
      return Object.assign({}, state, { isWaiting: true });
    case SIGNIN_SUCCESS_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true,
        email: action.data.logemail
      });
    case SIGNIN_ERROR_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: false
      });
    case SIGNUP_USER:
      return Object.assign({}, state, { isWaiting: true });
    case SIGNUP_SUCCESS_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true
      });
    case SIGNUP_ERROR_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: false
      });
    case SIGNOUT_USER:
      return Object.assign({}, state, { isWaiting: true });
    case SIGNOUT_SUCCESS_USER:
      return {
        isWaiting: false,
        authenticated: false
      };
    case SIGNOUT_ERROR_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true
      });
    case REGISTER_USER:
      return Object.assign({}, state, { isWaiting: true });
    case REGISTER_SUCCESS_USER:
      return Object.assign({}, state, { isWaiting: false });
    case REGISTER_ERROR_USER:
      return Object.assign({}, state, { isWaiting: false });
    default:
      return state;
  }
};
