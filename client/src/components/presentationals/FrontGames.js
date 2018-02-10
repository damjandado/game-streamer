import React from "react";
import { connect } from "react-redux";

import GameCard from "../presentationals/GameCard";
import Loader from "../presentationals/Loader";
import Alert from "../presentationals/Alert";

const FrontGames = props => {
  const topGamesProps = props.topGames;
  const status = topGamesProps.status;
  const gameCardItems = topGamesProps.games.map((tg, i) => (
    <GameCard
      key={tg.game._id}
      game={tg}
      name={tg.game.name}
      box={tg.game.box.medium}
      logo={tg.game.logo.medium}
      viewers={tg.viewers}
      channels={tg.channels}
      spanChannels={false}
      cardType={"game-card col " + (i === 10 || 11 ? "col-xl-2" : "")}
      cardCover={"game-cover"}
      logoArt={false}
    />
  ));
  const error = topGamesProps.error;
  return (
    <div className="gs-dashboard-games">
      {status === "loading" ? (
        <Loader />
      ) : status === "success" ? (
        <div className="stream-cards">{gameCardItems}</div>
      ) : status === "error" ? (
        <div>
          <Alert error={error} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

function mapStateToProps({ topGames }) {
  return { topGames };
}

export default connect(mapStateToProps)(FrontGames);
