import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

import Featured from './containers/Featured';
import TopGames from './TopGames';
import SearchResults from './SearchResults';
import Channel from './Channel';
import Navs from './Navs';
// import _ from "lodash";
      
class Landing extends Component {

  render() {
    return (
      <div className="container-fluid col-sm-10">
        <div className="tab-content">
          <div className="container-fluid tab-pane active">
            <Route exact path="/" component={Featured} />
            <Route path="/topgames" component={TopGames} />
            <Route path={"/" + this.props.embed} component={Channel} />
            <Route path="/search" component={SearchResults} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed, activeTab }) {
  return { embed, activeTab };
}

export default connect(mapStateToProps, actions)(Landing);
