import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import TopStreamEmbed from "../presentationals/TopStreamEmbed";

class AnonDash extends Component {
  componentDidMount() {
    this.props.fetchStreamAndClips("Twitch", 2);
    this.props.topGamesApi(12);
  }

  render() {
    return (
      <div className="row">
        <div className="gs-col-right col-md-auto">
          <TopStreamEmbed gprop={this.props.topGames} />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ clips, featured, topGames, dashboard }) {
  return { clips, featured, topGames, dashboard };
}

export default connect(
  mapStateToProps,
  actions
)(AnonDash);
