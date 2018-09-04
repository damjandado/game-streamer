import "font-awesome/css/font-awesome.min.css";
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
// import Raven from 'raven-js';
// import createRavenMiddleware from 'raven-for-redux';
import reducers from "./reducers";
// import { SIGNIN_SUCCESS_USER } from './actions/types';

import App from "./components/App";
import axios from "axios";
window.axios = axios;

/*Raven.config(
  'https://50ade61bac124605878ae86df7fb1cea@sentry.io/188244'
).install();*/

//intialize store
let store = createStore(
  reducers,
  {},
  applyMiddleware(thunk, logger)
  // applyMiddleware(thunk, logger, createRavenMiddleware(Raven, {}))
);

// const token = localStorage.getItem('token');
// // If we have a token, consider the user to be signed in
// if (token) {
//   // we need to update application state
//   store.dispatch({ type: SIGNIN_SUCCESS_USER, email });
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
