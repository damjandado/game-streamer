import React from "react";

import GameCard from "../presentationals/GameCard";
import Loader from "../presentationals/Loader";

export default ({ games }) => {
  const { status } = games;
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
        1: gameCardItems,
      }[status]}
    </div>
  );
};
