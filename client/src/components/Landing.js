import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/actions";

import Dashboard from "./content/Dashboard";
import Featured from "./content/Featured";
import TopGames from "./content/TopGames";
import Channel from "./content/Channel";
import SearchResults from "./content/SearchResults";
import RegistrationNew from './auth/RegistrationNew';
import LoginNew from './auth/LoginNew';

class Landing extends Component {
  render() {
    return (
      <div className="col container-fluid gs-landing">
        <div className="tab-content">
          <div className="tab-pane active">
            <Route exact path="/" component={Dashboard} />
            <Route path="/signin" component={LoginNew} />
            <Route path="/featured" component={Featured} />
            <Route path="/topgames" component={TopGames} />
            <Route path={"/" + this.props.embed.name} component={Channel} />
            <Route path="/search" component={SearchResults} />
            <Route path="/signup" component={RegistrationNew} />           
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
