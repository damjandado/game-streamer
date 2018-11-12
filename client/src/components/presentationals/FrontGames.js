import React from "react";
import { connect } from "react-redux";

import GameCard from "../presentationals/GameCard";
import Loader from "../presentationals/Loader";
import Alert from "../presentationals/Alert";

export default ({ games }) => {
  const { status, error } = games;
  const gameCardItems = games.list.map((tg) => (
    <GameCard
      key={tg.game._id}
      game={tg}
      name={tg.game.name}
      box={tg.game.box.medium}
      logo={tg.game.logo.medium}
      viewers={tg.viewers}
      channels={tg.channels}
      spanChannels={false}
      cardType={"game-card col col-xs-6 col-sm-3 col-lg-2"}
      cardCover={"game-cover"}
      logoArt={false}
    />
  ));
  return (
    <div className="row">
      {{loading: <Loader />,
        success: gameCardItems,
      }[status]}
    </div>
  );
};
