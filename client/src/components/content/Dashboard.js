import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import AnonDash from './AnonDash';
import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import Alert from '../presentationals/Alert';

class Dashboard extends Component {
  componentDidMount() {
    const { authenticated } = this.props.auth;
    if (!authenticated) {
      this.props.topGamesApi(12);
    }
  }

  renderDash() {
    const { dashboard } = this.props;
    const { status, broadcasters, games } = dashboard;
    const streamCardBroadcasters = broadcasters.map(bc =>
      <StreamCard
        key={bc._id}
        ebdStream={bc}
        streamCover={bc.preview.medium}
        name={bc.channel.display_name}
        game={bc.game}
        logo={bc.channel.logo}
      />
    );
    const streamCardGames = games.map(gm =>
      <StreamCard
        key={gm._id}
        ebdStream={gm}
        streamCover={gm.preview.medium}
        logo={gm.channel.logo}
        name={gm.channel.name}
        game={gm.channel.game}
      />
    );
    const Dashboard = (
      <div>
        <h3 className="text-center text-muted">Recommended Channels</h3>
        <div className="row">{streamCardBroadcasters}</div>
        <hr className="mt-0 mb-4" />
        <h3 className="text-center text-muted">Recommended Games</h3>
        <div className="row">{streamCardGames}</div>
      </div>
    );
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
    const { authenticated } = this.props.auth;
    return (
      <div>
        {authenticated ? (
          this.renderDash()
        ) : (
          <AnonDash />
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth, twitch: { dashboard } }) {
  return { auth, dashboard };
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
