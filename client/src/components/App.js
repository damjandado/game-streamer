import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

import Header from './Header';
import LeftBar from './LeftBar';
import Landing from './Landing';

//top level of React component hierarchy
class App extends Component {
  componentWillMount() {
    console.log('App PROPS are...', this.props);
    this.props.fetchUser();
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <div className="container-fluid text-left">
            <div className="row content">
              <LeftBar />              
              <Route path="/" component={Landing} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(null, actions)(App);
