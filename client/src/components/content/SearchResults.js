import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

class SearchResults extends Component {
  renderHeading = () => {
    const { status, error, searchTerm } = this.props;
    const term = <i className="text-info">{searchTerm}</i>;
    return (
      <h3 className="text-center text-muted">
      {{
        no_search: "No search yet.",
        0: "Nothing found.",
        1: <span>Games found for term: {term}</span>,
        2: <span>Streams found for term: {term}</span>,
        error: <Alert error={error} />,
      }[status]}
      </h3>
    )
  }

  renderStreams = () => {
    const { streams } = this.props;
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
    return (
      <div className="row">{listStreams}</div>
    );
  };
  
  renderGames = () => {
    const { games } = this.props;
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
    return (
      <div className="row">{listGames}</div>
    );
  };

  render() {
    const { status } = this.props;
    if (status === "loading") return <Loader />;
    return (
      <div className="main">
        {this.renderHeading()}
        {
          {
            1: <div>{this.renderGames()}</div>,
            2: <div>{this.renderStreams()}</div>,
          }[status]
        }
      </div>
    );
  }
}

function mapStateToProps({ search }) {
  return { ...search };
}

export default connect(mapStateToProps)(SearchResults);
