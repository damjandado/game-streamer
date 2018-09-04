import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Lazy } from "react-lazy";

import * as actions from "../../actions";

//Presentational React Component
class StreamCard extends Component {
  activeChannel() {
    this.props.embedStream(this.props.ebdStream);
    this.props.fetchChannelStream(this.props.ebdStream.user_id);
    this.props.saveActivity(this.props.ebdStream);
  }

  searchGame() {
    this.props.searchGamesApi({ search: this.props.game });
  }

  render() {
    const {
      streamCover,
      logo,
      title,
      name,
      game,
      history,
      searchGamesApi,
      userLogo
    } = this.props;
    const width = userLogo ? 200 : "100%";
    return (
      <div className="stream-card">
        <div className="gs-video-thumbnail">
          <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
            <Lazy component="span" cushion={200}>
              <img
                className="stream-cover"
                src={streamCover}
                alt={title}
                style={{ width }}
              />
            </Lazy>
          </Link>
        </div>
        <div className="gs-stream-info">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} alt="logo" />
            </figure>
          </div>
          <div className="stream-details">
            <span className="font-weight-bold">{title}</span>
            <br />
            <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
              {name}
            </Link>{" "}
            plays{" "}
            <Link
              to={"/search"}
              onClick={() => searchGamesApi({ search: game }, history)}
            >
              {game}
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

export default connect(
  mapStateToProps,
  actions
)(withRouter(StreamCard));
