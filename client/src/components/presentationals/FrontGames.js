import React from "react";

import GameCard from "../presentationals/GameCard";
import Loader from "../presentationals/Loader";

export default ({ games }) => {
  const { status } = games;
  const gameCardItems = games.list && games.list.map((tg) => (
    <GameCard
      key={tg.id}
      game={tg}
      name={tg.name}
      box={tg.box_art_url.replace('{width}', '300').replace('{height}', '300')}
      // logo={tg.game.logo.medium}
      // viewers={tg.viewers}
      // channels={tg.channels}
      // spanChannels={false}
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
