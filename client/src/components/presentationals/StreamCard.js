import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";

//Presentational React Component
class StreamCard extends Component {
  activeChannel() {
    this.props.embedStream(this.props.ebdStream);
  }

  render() {
    const { streamCover, logo, title, name, game } = this.props;
    return (
      <div className="stream-card" onClick={this.activeChannel.bind(this)}>
        <div className="gs-video-thumbnail">
          <Link to={`/${name}`}>
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
            <Link to={`/${name}`}>
              <span className="gs-game">{game}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, actions)(StreamCard);
