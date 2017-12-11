import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

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
        box = { tg.game.box.medium }
        logo = { tg.game.logo.medium }
        viewers = { tg.viewers }
        channels = { tg.channels }
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

export default connect(mapStateToProps, actions)(TopGames); 
