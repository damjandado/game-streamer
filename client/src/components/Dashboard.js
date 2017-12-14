import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as apiCalls from '../actions/apiCalls';

import Loader from './presentationals/Loader';
import StreamCard from './presentationals/StreamCard';
import Alert from './presentationals/Alert';

class Dashboard extends Component {
  componentDidMount() {
    this.props.populateDashboard();
  }
  render() {
    const dsProps = this.props.dashboard;
    const status = dsProps.status;
    const streamCardBroadcasters = dsProps.broadcasters.map(bc => {
      if (bc !== null)
        return (
          <StreamCard
            key={bc.id}
            ebdStream={bc}
            streamCover={bc.thumbnail_url}
            title={bc.title}
            name={bc.display_name}
            game={bc.game_id}
          />
        );
    });
    const streamCardGames = dsProps.games.map(gm => {
      if (gm !== null)
        return (
          <StreamCard
            key={gm._id}
            ebdStream={gm}
            streamCover={gm.preview.medium}
            logo={gm.channel.logo}
            name={gm.channel.name}
            game={gm.channel.game}
          />
        );
    });
    const error = dsProps.error;
    return (
      <div>
        <div className="main">
          {status === 'loading' ? (
            <Loader />
          ) : status === 'success' ? (
            <div className="stream-cards">{streamCardBroadcasters}</div>
          ) : status === 'error' ? (
            <div>
              <Alert error={error} />
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="main">
          {status === 'loading' ? (
            <Loader />
          ) : status === 'success' ? (
            <div className="stream-cards">{streamCardGames}</div>
          ) : status === 'error' ? (
            <div>
              <Alert error={error} />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapStateToProps, apiCalls)(Dashboard);
