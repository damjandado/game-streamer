import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as apiCalls from '../../actions/apiCalls';

import AnonDash from './AnonDash';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
// import GameCard from "../presentationals/GameCard";
import Alert from '../presentationals/Alert';

class Dashboard extends Component {
  componentDidMount() {
    this.props.populateDashboard();
  }

  renderDash() {
    const dash = this.props.dashboard;
    const status = dash.status;
    console.log('C H A N N E L S', dash.broadcasters);
    const streamCardBroadcasters = dash.broadcasters.map(bc => {
      if (bc !== null)
        return (
          <StreamCard
            key={bc.id}
            ebdStream={bc}
            streamCover={bc.thumbnail_url}
            title={bc.title}
            name={bc.display_name}
            game={bc.game}
          />
        );
    });
    const streamCardGames = dash.games.map(gm => {
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
    const error = dash.error;
    return (
      <div>
        <div className="main">
          {status === 'loading' ? (
            <Loader />
          ) : status === 'success' ? (
            <div>
              <h3>Recommended Channels</h3>
              <div className="stream-cards">{streamCardBroadcasters}</div>
            </div>
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
            <div>
              <h3>Recommended Games</h3>
              <div className="stream-cards">{streamCardGames}</div>
            </div>
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

  renderAnonDash() {
    return <AnonDash />;
  }

  render() {
    return (
      <div>
        {this.props.auth.authenticated
          ? this.renderDash()
          : this.renderAnonDash()}
      </div>
    );
  }
}

function mapStateToProps({ auth, dashboard }) {
  return { auth, dashboard };
}

export default connect(mapStateToProps, apiCalls)(Dashboard);
