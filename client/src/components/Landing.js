import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

import Featured from './containers/Featured';
import TopGames from './TopGames';
import SearchResults from './SearchResults';
import Channel from './Channel';
// import _ from "lodash";
// import 'twitch-embed';
      
class Landing extends Component {

  render() {
    return (
      <div className="container-fluid col-sm-10">
        <ul className="nav nav-pills" role="tablist">
          <li className="nav-item" onClick={() => this.props.toggleActive("featured")}>
            <Link className={"btn btn-outline-success my-2 my-sm-0" + (this.props.activeTab.featured ? " active" : "")} to="/">
              Featured
            </Link>
          </li>
          <li className="nav-item" onClick={() => this.props.toggleActive("top")}>
            <Link className={"btn btn-outline-success my-2 my-sm-0" + (this.props.activeTab.top ? " active" : "")} to="/topgames">
              Top Games
            </Link>
          </li>
          <li className="nav-item" onClick={() => this.props.toggleActive("search")}>
            <Link className={"btn btn-outline-success my-2 my-sm-0" + (this.props.activeTab.search ? " active" : "")} to="/search">
              Search Results
            </Link>
          </li>
          <li className="nav-item" onClick={() => this.props.toggleActive("channel")}>
            <Link className={"btn btn-outline-success my-2 my-sm-0" + (this.props.activeTab.channel ? " active" : "")} to={"/" + this.props.embed}>
              Channel
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          <div className="container-fluid tab-pane active">
            <Route exact path="/" component={Featured} />
            <Route path="/topgames" component={TopGames} />
            <Route path="/search" component={SearchResults} />
            <Route path={"/" + this.props.embed} component={Channel} />
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
