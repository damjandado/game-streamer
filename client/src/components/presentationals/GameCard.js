import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";

//Presentational React Component
class GameCard extends Component {
  activeChannel() {
    this.props.searchGamesApi({ search: this.props.name });
  }

  render() {
    const { box, logo, name, viewers, channels } = this.props;
    return (
      <div className="stream-card" onClick={this.activeChannel.bind(this)}>
        <div className="gs-video-thumbnail">
          <Link to={`/${name}`}>
            <img className="stream-cover" src={box} />
          </Link>
        </div>
        <div className="gs-video-details">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} />
            </figure>
          </div>
          <div className="stream-details">
            <span className="font-weight-bold">{name}</span>
            <br />
            <span className=".gs-views">viewers: {viewers}</span> |
            <span className=".gs-views"> channels: {channels}</span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, actions)(GameCard);
