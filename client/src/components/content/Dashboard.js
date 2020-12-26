import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import AnonDash from './AnonDash';
import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

class Dashboard extends Component {
  componentDidMount() {
    const { authenticated } = this.props.auth;
    if (authenticated) {
      this.props.topGamesApi(12);
    }
  }

  renderDash() {
    const { auth, dashboard, featured, top } = this.props;
    if (!auth.authenticated)
        return <AnonDash />
    const { status, broadcasters, games, } = dashboard;
    const streamCardStreams = broadcasters.map(bc =>
      <StreamCard key={bc.id} stream={bc} />
    );
    const streamCardGames = games.map(gm =>
      <GameCard key={gm.id} game={gm} />
    );
    const Dashboard = (
      <div>
        <h3 className="text-center text-muted tw-users">Recommended Channels</h3>
        <div className="row">{streamCardStreams}</div>
        <hr className="mt-0 mb-4" />
        <h3 className="text-center text-muted tw-games">Recommended Games</h3>
        <div className="row">{streamCardGames}</div>
      </div>
    );
    console.log('status', status);
    return (
      <div className="main">
        {
          {
            loading: <Loader />,
            success: Dashboard,
            error: <Alert />
          }[status]
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDash()}
      </div>
    );
  }
}

function mapStateToProps({ auth, twitch: { dashboard, featured, top } }) {
  return { auth, dashboard, featured, top };
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
