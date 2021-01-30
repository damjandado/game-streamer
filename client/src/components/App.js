import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Header from './navigation/Header';
import LeftBar from './navigation/LeftBar';
import Landing from './Landing';
import * as actions from '../actions';

const App = () => {
    const dispatch = useDispatch();
    const twAccessToken = useSelector((state) => state.auth.twAccessToken);
    useEffect(() => {
        dispatch(actions.fetchUserData());
    }, []);

    useEffect(() => {
        twAccessToken && dispatch(actions.featuredApi());
    }, [twAccessToken]);

    return (
        <Router>
            <Header />
            <div className="gs-content d-flex">
                <LeftBar />
                <Route path="/" component={Landing} />
            </div>
        </Router>
    );
};

export default App;
