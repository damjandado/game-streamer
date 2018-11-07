import "font-awesome/css/font-awesome.min.css";
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

import App from "./components/App";
import axios from "axios";
window.axios = axios;

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
let store = createStore(
  reducers,
  {},
  // applyMiddleware(thunk)
  compose(applyMiddleware(thunk), reduxDevTools)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
