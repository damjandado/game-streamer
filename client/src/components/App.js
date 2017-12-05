import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
// import Landing from './containers/Landing';
import Streams from './containers/Streams';
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
          {/*         <LeftBar />
          <Route exact path="/" component={Landing} />
          <Route exact path={"/" + streamer} component={Stream} />
          <Route path="/surveys/new" component={Profile} />*/}
          <Streams />
        </div>
      </Router>
    );
  }
}

export default connect(null, actions)(App);
