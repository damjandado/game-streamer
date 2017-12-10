import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";

//Presentational React Component
class StreamCard extends Component {
  activeChannel() {
    this.props.embedStream(this.props.streamChannel);
  }

  render() {
    const { streamChannel, streamCover, logo, title, name, game } = this.props;
    return (
      <div className="stream-card" onClick={this.activeChannel.bind(this)}>
        <div className="gs-video-thumbnail">
          <Link to={`/${streamChannel.name || streamChannel.login}`}>
            <img className="stream-cover" src={streamCover} />
          </Link>
        </div>
        <div className="gs-video-details">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} />
            </figure>
          </div>
          <div className="stream-details">
            <span className="font-weight-bold">{title}</span>
            <br />
            <span className="gs-name">{name}</span> plays{" "}
            <span className="gs-game">{game}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(StreamCard);
