import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import Alert from '../presentationals/Alert';

import * as actions from '../../actions';

class SearchResults extends Component {
  componentDidMount() {
    console.log('SearchResults Component mounted');
    // this.props.fetchSearchRequest();
    this.props.toggleActive('search');
  }

  render() {
    const searchProps = this.props.search;
    const { games, users, status, term } = searchProps;
    const termX = <i className="text-info">{term}</i>;
    const streamCardUsers = users.length
      ? searchProps.users.map(user => (
          <StreamCard
            key={user.id}
            ebdStream={user}
            streamCover={user.profile_image_url}
            logo={user.profile_image_url}
            name={user.login}
            userLogo={true}
          />
        ))
      : null;
    const streamCardGames = games.length
      ? searchProps.games.map(game => (
          <StreamCard
            key={game._id}
            ebdStream={game}
            streamCover={game.preview.medium}
            logo={game.channel.logo}
            name={game.channel.name}
            game={game.channel.game}
          />
        ))
      : null;
    const renderSCU = streamCardUsers ? (
      <div>
        <h3 className="text-center text-muted">
          {`Users found for term `}
          {termX}
        </h3>
        <div className="stream-cards">{streamCardUsers}</div>
      </div>
    ) : (
      <div />
    );
    const renderSCG = streamCardGames ? (
      <div>
        <h3 className="text-center text-muted">
          {`Streams found for term `}
          {termX}
        </h3>
        <div className="stream-cards">{streamCardGames}</div>
      </div>
    ) : (
      <div />
    );
    const error = searchProps.error;
    return (
      <div className="main">
        {status === 'no_search' ? (
          <h3 className="text-center text-muted" style={{ marginTop: 50 }}>
            No search yet.
          </h3>
        ) : status === 'loading' ? (
          <Loader />
        ) : status === 'success' ? (
          <div>
            {renderSCU}
            {renderSCG}
          </div>
        ) : status === 'error' ? (
          <div>
            <Alert error={error} />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps, actions)(SearchResults);
