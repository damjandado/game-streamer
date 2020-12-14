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
    if (authenticated) {
      this.props.topGamesApi(12);
    }
  }

  renderDash() {
    const { auth, featured, top } = this.props;
    if (!auth.authenticated)
        return <AnonDash />
    const { status: statusFS, list: listFeaturedStreams = [] } = featured;
    const { status: statusTG, list: listTopGames } = top;
    let status = 'loading';
    console.log('statusFS -> statusTG', statusFS, statusTG);
    if (statusFS === 'success' && statusTG === 'success')
        status = 'success';
    console.log('listTopGames', listTopGames);
    console.log('listFeaturedStreams', listFeaturedStreams);
    const streamCardStreams = listFeaturedStreams.map(bc =>
      <StreamCard
        key={bc.id}
        ebdStream={bc}
        streamCover={bc.thumbnail_url.replace(/\{width\}|\{height\}/g, '300')}
        name={bc.user_name}
        game={bc.game_name}
        // logo={bc.channel.logo}
      />
    );
    const streamCardGames = listTopGames.map(gm =>
      <StreamCard
        key={gm.id}
        // ebdStream={gm}
        streamCover={gm.box_art_url.replace(/\{width\}|\{height\}/g, '300')}
        // logo={gm.channel.logo}
        // name={gm.channel.name}
        game={gm.name}
      />
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

function mapStateToProps({ auth, twitch: { featured, top } }) {
  return { auth, featured, top };
}

export default connect(
  mapStateToProps,
  actions
)(Dashboard);
