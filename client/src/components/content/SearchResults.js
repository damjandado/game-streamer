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
    const { status, term, games, streams } = searchProps;
    const termX = <i className="text-info">{term}</i>;
    const listStreams = streams.map(game => (
      <StreamCard
        key={game._id}
        ebdStream={game}
        streamCover={game.preview.medium}
        logo={game.channel.logo}
        name={game.channel.name}
        game={game.channel.game}
      />
    ));
    const listGames = games.map(item => (
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
    const renderStreams = (
      <div>
        <h3 className="text-center text-muted">
          {`Streams found for term `}
          {termX}
        </h3>
        <div className="row">{listStreams}</div>
      </div>
    );
    const renderGames = (
      <div>
        <h3 className="text-center text-muted">{termX} and similar games:</h3>
        <div className="row">{listGames}</div>
      </div>
    );
    const error = searchProps.error;
    if (!streams.length && !games.length && status === 'not_found')
      return (
        <h3 className="text-center text-muted mt-2">
          Nothing found.
        </h3>
      );
    return (
      <div className="main">
        {
          {
            no_search: (
              <h3 className="text-center text-muted mt-2">No search yet.</h3>
            ),
            loading: <Loader />,
            found_streams: <div>{renderStreams}</div>,
            found_games: <div>{renderGames}</div>,
            error: <Alert error={error} />,
          }[status]
        }
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
