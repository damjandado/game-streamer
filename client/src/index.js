import './styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './styles/main.css';
import './styles/login.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';
import App from './components/App';

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
let store;
if (reduxDevTools) {
    store = createStore(reducer, compose(applyMiddleware(thunk), reduxDevTools));
} else {
    store = createStore(reducer, applyMiddleware(thunk));
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);
