import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import TopStreamEmbed from '../presentationals/TopStreamEmbed';
import FrontGames from '../presentationals/FrontGames';

class AnonDash extends Component {
  render() {
    const { channel, games } = this.props;
    return (
      <div className="row">
        <div className="col-xl-8">
          <TopStreamEmbed channel={channel} />
          <div className="col-sm-12 most-pop-games">
            <hr className="mt-0 mb-4" />
            <h3 className="text-center text-muted">Most Popular Games</h3>
            <FrontGames games={games} />
          </div>
        </div>
        <div className="col-xl-4 d-none d-xl-block">
          <div className="row"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ twitch: { featured, top } }) {
  return { channel: featured.list[0], games: top };
}

export default connect(
  mapStateToProps,
  actions
)(AnonDash);
