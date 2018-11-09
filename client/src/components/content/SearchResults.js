import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

import * as actions from '../../actions';

class SearchResults extends Component {
  componentDidMount() {
    this.props.toggleActive('search');
  }

  render() {
    const searchProps = this.props.search;
    const { games, users, status, foundGames, term } = searchProps;
    const termX = <i className="text-info">{term}</i>;
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
    const listFoundGames = foundGames.map(item => (
      <GameCard
        key={item.game._id}
        game={item}
        name={item.game.name}
        box={item.game.box.large}
        logo={item.game.logo.medium}
        viewers={item.viewers}
        channels={item.channels}
        spanChannels={true}
        cardType={'game-card col col-xs-6 col-md-2 col-xl-1'}
        cardCover={'stream-cover'}
        logoArt={true}
      />
    ));
    const renderSCG = streamCardGames ? (
      <div>
        <h3 className="text-center text-muted">
          {`Streams found for term `}
          {termX}
        </h3>
        <div className="row">{streamCardGames}</div>
      </div>
    ) : (
      <div />
    );
    const renderFoundGames = (
      <div>
        <h3 className="text-center text-muted">
          {termX} and similar games:  
        </h3>
        <div className="row">{listFoundGames}</div>
      </div>
    );
    const error = searchProps.error;
    if (!streamCardGames && !listFoundGames && status === 'success')
      return (
        <h3 className="text-center text-muted" style={{ marginTop: 50 }}>
          Nothing found.
        </h3>
      );
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
            <div>{renderFoundGames}</div>
            <div>
              {renderSCG}
            </div>
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

export default connect(
  mapStateToProps,
  actions
)(SearchResults);
