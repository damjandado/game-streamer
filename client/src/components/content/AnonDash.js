import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withLoading } from '../Hoc';

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
  return { channel: featured.list && featured.list.length ? featured.list[0] : { name: 'monstercat' }, games: top };
}

let loadingCondition = (props) => false;

export default compose(
    connect(mapStateToProps, actions),
    withLoading(loadingCondition),
)(AnonDash);
