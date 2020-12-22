import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Loader from "../presentationals/Loader";
import GameCard from "../presentationals/GameCard";
import Alert from "../presentationals/Alert";

class TopGames extends Component {
  componentDidMount() {
    this.props.topGamesApi(60, 0);
  }

  render() {
    const { games } = this.props;
    const { status } = games;
    if (!games.list) return null;
    console.log('games:', games);
    const gameCardItems = games.list.map((tg, i) => (
      <GameCard
        key={tg.id}
        game={tg}
        name={tg.name}
        box={tg.box_art_url}
        cardType={"game-card col col-xs-6 col-md-2 col-xl-1"}
        cardCover={"stream-cover"}
      />
    ));
    return (
      <div className="main">
        <h3 className="text-center text-muted">Top Games on Twitch</h3>
        {{
          loading: <Loader />,
          success: <div className="row">{gameCardItems}</div>,
          error: <div><Alert error={status} /></div>,
        }[status]}
      </div>
    );
  }
}

function mapStateToProps({ twitch }) {
  return { games: twitch.top };
}

export default connect(
  mapStateToProps,
  actions
)(TopGames);
