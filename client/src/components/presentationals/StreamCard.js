import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";
import * as apiCalls from "../../actions/apiCalls";

//Presentational React Component
class StreamCard extends Component {
  activeChannel() { 
    this.props.embedStream(this.props.ebdStream);
    this.props.saveActivity(this.props.ebdStream);
  }

  searchGame() {
    this.props.searchGamesApi({ search: this.props.game });
  }

  render() {
    console.log(this.props.ebdStream);
    const { streamCover, logo, title, name, game } = this.props;
    return (
      <div className="stream-card">
        <div className="gs-video-thumbnail">
          <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
            <img className="stream-cover" src={streamCover} />
          </Link>
        </div>
        <div className="gs-stream-info">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} />
            </figure>
          </div>
          <div className="stream-details">
            <span className="font-weight-bold">{title}</span>
            <br />
            <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
              {name}
            </Link>{" "}
            plays{" "}
            <Link to={"/search"} onClick={this.searchGame.bind(this)}>
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

export default connect(mapStateToProps, {
  embedStream: actions.embedStream,
  saveActivity: actions.saveActivity,
  searchGamesApi: apiCalls.searchGamesApi
})(StreamCard);
