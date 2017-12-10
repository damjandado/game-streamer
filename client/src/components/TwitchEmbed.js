import React from "react";

export default ({ channel }) => {
  return (
    <div className="twitchWrapper">
      <div className="twitchStream">
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}`}
          width="300"
          height="150"
          frameBorder="0"
          scrolling="no"
        />
      </div>
      <div className="twitchChat">
        <iframe
          src={`https://www.twitch.tv/${channel}/chat`}
          width="300"
          height="150"
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </div>
  );
};
