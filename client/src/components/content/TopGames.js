import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Loader from "../presentationals/Loader";
import GameCard from "../presentationals/GameCard";
import Alert from "../presentationals/Alert";

class TopGames extends Component {
  componentDidMount() {
    this.props.fetchTopRequest();
    this.props.topGamesApi(60, 0);
    this.props.toggleActive("top");
  }

  render() {
    const { games } = this.props;
    const status = games.status;
    const gameCardItems = games.list.map((tg, i) => (
      <GameCard
        key={tg.game._id}
        game={tg}
        name={tg.game.name}
        box={tg.game.box.large}
        logo={tg.game.logo.medium}
        viewers={tg.viewers}
        channels={tg.channels}
        spanChannels={true}
        cardType={"game-card col col-xs-6 col-md-2 col-xl-1"}
        cardCover={"stream-cover"}
        logoArt={true}
      />
    ));
    const error = games.error;
    return (
      <div className="main">
        <h3 className="text-center text-muted">Top Games on Twitch</h3>
        {status === "loading" ? (
          <Loader />
        ) : status === "success" ? (
          <div className="row">{gameCardItems}</div>
        ) : status === "error" ? (
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

function mapStateToProps({ topGames }) {
  return { games: topGames };
}

export default connect(
  mapStateToProps,
  actions
)(TopGames);
