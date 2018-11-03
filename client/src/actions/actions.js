import axios from "axios";
import * as types from "./types";

export const onSignup = values => async dispatch => {
  dispatch(beginSignup());
  const res = await makeUserRequest("post", values, "/local/signup");
  try {
    if (res.data.success) {
      await axios.post("/api/send_email", {
        email: values.email,
        template: values.template
      });
    } else {
      dispatch(signupError());
      let signupMessage = res.data.message;
      return signupMessage;
    }
  } catch (e) {
    if (e instanceof Error) {
    }
  }
};

export const onLogin = (values, remember, path, history) => async dispatch => {
  dispatch(beginLogin());
  values.remember = remember;
  const res = await makeUserRequest("post", values, "/local/login");
  try {
    if (res.data.success) {
      dispatch(loginSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      history.push(path);
    } else {
      dispatch(loginError());
      let loginMessage = res.data.message;
      return loginMessage;
    }
  } catch (e) {
  }
};

export const onLogout = history => async dispatch => {
  dispatch(beginLogout());
  const res = await axios.get("/api/logout");
  try {
    if (res.data.success) {
      dispatch(logoutSuccess());
      localStorage.removeItem("token");
      history.push("/");
    } else {
      dispatch(logoutError());
    }
  } catch (e) {
    console.log("Error", res.message);
  }
};

function makeUserRequest(method, data, api = "/local/login") {
  return axios({
    method: method,
    url: api,
    data: data
  });
}

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: types.LOGIN_USER });
  dispatch({ type: types.FETCH_USER, payload: res.data });
};

export const sendMail = values => async dispatch => {
  const res = await axios.post("/api/send_email", values);
  try {
    if (res.data.success) {
      dispatch({ type: types.SEND_MAIL, userId: res.data.userId });
    }
  } catch (e) {
  }
};

export const checkEmail = email => async dispatch => {
  const res = await makeUserRequest("POST", email, "/api/check_email");
  if (res.data.valid) {
    dispatch({ type: types.CHECK_MAIL, payload: true });
  } else {
    dispatch({ type: types.CHECK_MAIL, payload: false });
  }
};

// "Login" action creators
function beginLogin() {
  return { type: types.LOGIN_USER };
}

function loginSuccess(data) {
  return {
    type: types.LOGIN_SUCCESS_USER,
    data
  };
}

function loginError() {
  return { type: types.LOGIN_ERROR_USER };
}

// "Logout" action creators
function beginLogout() {
  return { type: types.LOGOUT_USER };
}

function logoutSuccess() {
  return { type: types.LOGOUT_SUCCESS_USER };
}

function logoutError() {
  return { type: types.LOGOUT_ERROR_USER };
}

// "Signup" action creators
function beginSignup() {
  return { type: types.SIGNUP_USER };
}

// function signupSuccess() {
//   return { type: types.SIGNUP_SUCCESS_USER };
// }

function signupError() {
  return { type: types.SIGNUP_ERROR_USER };
}

export function fetchRequest() {
  return {
    type: types.FETCH_FEATURED_REQUEST,
    status: "loading"
  };
}

export function fetchSuccess(featured) {
  return {
    type: types.FETCH_FEATURED_SUCCESS,
    status: "success",
    featured
  };
}

export function fetchSuccessLoading(featured) {
  return {
    type: types.FETCH_FEATURED_SUCCESS,
    status: "loading",
    featured
  };
}

export function fetchFailure(error) {
  return {
    type: types.FETCH_FEATURED_FAILURE,
    status: "error",
    error
  };
}

export function fetchTopRequest() {
  return {
    type: types.FETCH_TOPGAMES_REQUEST,
    status: "loading"
  };
}

export function fetchTopSuccess(streams) {
  return {
    type: types.FETCH_TOPGAMES_SUCCESS,
    status: "success",
    streams
  };
}

export function fetchTopFailure(error) {
  return {
    type: types.FETCH_TOPGAMES_FAILURE,
    status: "error",
    error
  };
}

export function noSearch() {
  return {
    type: types.NO_SEARCH,
    status: "no_search"
  };
}

export function fetchSearchRequest(term) {
  return {
    type: types.FETCH_SEARCH_REQUEST,
    term,
    status: "loading"
  };
}

export function fetchSearchSuccess(users, games) {
  return {
    type: types.FETCH_SEARCH_SUCCESS,
    status: "success",
    users,
    games
  };
}

export function fetchSearchFailure(error) {
  return {
    type: types.FETCH_SEARCH_FAILURE,
    status: "error",
    error
  };
}

export const saveActivity = entity => async dispatch => {
  const res = await axios.post("/api/twitch/users", entity);

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
