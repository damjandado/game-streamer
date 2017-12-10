import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

import Navs from './Navs';
import Featured from './main/Featured';
import TopGames from './main/TopGames';
import Channel from './main/Channel';
import SearchResults from './main/SearchResults';
      
class Landing extends Component {
  render() {
    return (
      <div className="col container-fluid gs-landing">
        <div className="tab-content">
          <div className="tab-pane active">
            <Route exact path="/" component={Featured} />
            <Route path="/topgames" component={TopGames} />
            <Route path={"/" + this.props.embed.name} component={Channel} />
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
