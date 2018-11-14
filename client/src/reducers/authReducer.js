import {
  FETCH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  SEND_MAIL,
  CHECK_MAIL,
} from "../actions/types";

const initialState = {
  isWaiting: false,
  authenticated: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      const user = action.payload;
      return user
        ? Object.assign(
            {},
            state,
            { user },
            { authenticated: true, isWaiting: false }
          )
        : Object.assign({}, state, { authenticated: false, isWaiting: false });
    case LOGIN_USER:
      return Object.assign({}, state, { isWaiting: true });
    case LOGOUT_USER:
      return Object.assign({}, state, { isWaiting: true });
    case CHECK_MAIL:
      return Object.assign({}, state, { emailExists: action.payload });
    case SEND_MAIL:
      return Object.assign({}, state, { userId: action.userId || "" });
    default:
      return state;
  }
};
