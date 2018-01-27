import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/actions";

import Dashboard from "./content/Dashboard";
import Featured from "./content/Featured";
import TopGames from "./content/TopGames";
import Channel from "./content/Channel";
import SearchResults from "./content/SearchResults";
import SignupNew from './auth/SignupNew';
import LoginNew from './auth/LoginNew';
import Recovery from './auth/Recovery';

class Landing extends Component {
  render() {
    return (
      <div className="col container-fluid gs-landing">
        <div className="tab-content">
          <div className="tab-pane active">
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={LoginNew} />
            <Route path="/signup" component={SignupNew} />           
            <Route path="/recovery" component={Recovery} />           
            <Route path="/featured" component={Featured} />
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
