import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import LeftBar from './LeftBar';
import Landing from './Landing';
// import Profile from './containers/Profile';

//top level of React component hierarchy
class App extends Component {
  componentDidMount() {
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
              <Route exact path="/" component={Landing} />
              {/*<Route path="/profile" component={Profile} />*/}
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, actions)(App);
