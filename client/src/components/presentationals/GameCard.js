import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Lazy } from "react-lazy";

import * as actions from "../../actions";

//Presentational React Component
class GameCard extends Component {
  state = { truncated: false };

  showTooltip() {
    // console.log('this.span.offsetWidth - ', this.span.offsetWidth);
    if (this.span.offsetWidth > this.info.offsetWidth) {
      this.setState({ truncated: true });
    } else {
      this.setState({ truncated: false });
    }
  }

  render() {
    const {
      box,
      name,
      viewers,
      channels,
      spanChannels,
      cardType,
      cardCover,
      history,
      searchGamesApi
    } = this.props;
    let trunc = this.state.truncated;
    return (
      <div className={cardType}>
        <div className="gs-video-thumbnail">
          <Link
            to={"/search"}
            onClick={() => searchGamesApi({ search: name }, history)}
          >
            <Lazy component="span" cushion={200}>
              <img className={cardCover} src={box} alt={name} />
            </Lazy>
          </Link>
        </div>
        <div className="gs-game-info" ref={div => (this.info = div)}>
          <div
            className="game-details iffyTip"
            onMouseOver={this.showTooltip.bind(this)}
          >
            <Link
              to={"/search"}
              onClick={() => searchGamesApi({ search: name }, history)}
            >
              {trunc}
              <span
                className="font-weight-bold"
                data-tip={name}
                ref={span => {
                  this.span = span;
                }}
              >
                {name}
              </span>
              {trunc ? (
                <ReactTooltip
                  place="bottom"
                  type="dark"
                  effect="solid"
                  offset={{ bottom: 20, right: 50 }}
                />
              ) : (
                ""
              )}
            </Link>
            <div>
              <span className=".gs-views">viewers: {viewers}</span>
              <br />
              {spanChannels ? (
                <span className=".gs-views">channels: {channels}</span>
              ) : (
                <span />
              )}
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

export default connect(
  mapStateToProps,
  actions
)(withRouter(GameCard));
