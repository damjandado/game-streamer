import {
  FETCH_USER,
  LOGIN_USER,
  LOGIN_SUCCESS_USER,
  LOGIN_ERROR_USER,
  SIGNUP_USER,
  SIGNUP_SUCCESS_USER,
  SIGNUP_ERROR_USER,
  LOGOUT_USER,
  LOGOUT_SUCCESS_USER,
  LOGOUT_ERROR_USER,
  SEND_MAIL,
  CHECK_MAIL
} from '../actions/types';

const initialState = {
  isWaiting: false,
  authenticated: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      // const token = localStorage.getItem('token');
      const user = action.payload;
      console.log('u s e r ', user);
      return user
        ? Object.assign({}, state, { user }, { authenticated: true })
        : Object.assign({}, state, { authenticated: false });
    case LOGIN_USER:
      return Object.assign({}, state, { isWaiting: true });
    case LOGIN_SUCCESS_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true,
        email: action.data.logemail
      });
    case LOGIN_ERROR_USER:
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
    case LOGOUT_USER:
      return Object.assign({}, state, { isWaiting: true });
    case LOGOUT_SUCCESS_USER:
      return {
        isWaiting: false,
        authenticated: false
      };
    case LOGOUT_ERROR_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true
      });
	case CHECK_MAIL:
      return Object.assign({}, state, { emailExists: action.payload });
    case SEND_MAIL:
      return Object.assign({}, state, { slugId: action.slugId || '' });
    default:
      return state;
  }
};
