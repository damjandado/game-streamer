import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import Alert from '../presentationals/Alert';

import * as actions from '../../actions';

class SearchResults extends Component {
  componentDidMount() {
    console.log('SearchResults Component mounted');
    this.props.toggleActive('search');
  }

  render() {
    const searchProps = this.props.search;
    const status = searchProps.status;
    const streamCardUsers = searchProps.users.map(user => (
      <StreamCard
        key={user.id}
        ebdStream={user}
        streamCover={user.profile_image_url}
        logo={user.profile_image_url}
        name={user.login}
      />
    ));
    const streamCardGames = searchProps.games.map(game => (
      <StreamCard
        key={game._id}
        ebdStream={game}
        streamCover={game.preview.medium}
        logo={game.channel.logo}
        name={game.channel.name}
        game={game.channel.game}
      />
    ));
    const error = searchProps.error;
    return (
      <div className="main">
        {status === 'loading' ? (
          <Loader />
        ) : status === 'success' ? (
          <div>
            <div className="stream-cards">{streamCardUsers}</div>
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
    );
  }
}

function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps, actions)(SearchResults);
