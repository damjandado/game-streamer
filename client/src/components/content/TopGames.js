import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as apiCalls from '../../actions/apiCalls';

import Loader from '../presentationals/Loader';
import GameCard from  '../presentationals/GameCard';
import Alert from  '../presentationals/Alert';

class TopGames extends Component {
  componentDidMount () {
    this.props.topGamesApi();
  }

  render() {
    const topGamesProps = this.props.topGames;
    const status = topGamesProps.status;
    const gameCardItems = topGamesProps.games.map((tg) =>
      <GameCard
        key = { tg.game._id }
        game = { tg }
        name = { tg.game.name }
        box = { tg.game.box.large }
        logo = { tg.game.logo.medium }
        viewers = { tg.viewers }
        channels = { tg.channels }
        spanChannels = {true}
        cardType={'game-card'}
        cardCover={'stream-cover'}
        logoArt={true}
        maxWidth={'200px'}
      />
    );
    const error = topGamesProps.error;
    return (
      <div className="main">
      {status === "loading" ? (
         <Loader />
       ) : (
          status === "success" ? (
            <div className="stream-cards">
            {gameCardItems}
            </div>
          ) : (
            status === "error" ? (
              <div>
                <Alert error = { error } />
              </div>
            ) : (
              <div></div>
            )
          )
        )
      }
      </div>
    )
  }
}

function mapStateToProps({ topGames }) {
  return { topGames };
}

export default connect(mapStateToProps, apiCalls)(TopGames); 
