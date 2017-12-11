import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as apiCalls from "../../actions/apiCalls";

//Presentational React Component
class GameCard extends Component {
  searchGame() {
    this.props.searchGamesApi({ search: this.props.name });
  }

  render() {
    const { box, logo, name, viewers, channels } = this.props;
    console.log(this.props.name);
    return (
      <div className="stream-card">
        <div className="gs-video-thumbnail">
          <Link to={"/search"} onClick={this.searchGame.bind(this)}>
            <img className="stream-cover" src={box} />
          </Link>
        </div>
        <div className="gs-game-info">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} />
            </figure>
          </div>
          <div className="game-details">
            <Link to={"/search"} onClick={this.searchGame.bind(this)}>
              <span className="font-weight-bold">{name}</span>
            </Link>
            <div>
            <span className=".gs-views">viewers: {viewers}</span> |
            <span className=".gs-views"> channels: {channels}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, apiCalls)(GameCard);
