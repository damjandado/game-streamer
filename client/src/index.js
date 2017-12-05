import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import Raven from 'raven-js';
// import createRavenMiddleware from 'raven-for-redux';
import reducers from './reducers';

import App from './components/App';

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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
