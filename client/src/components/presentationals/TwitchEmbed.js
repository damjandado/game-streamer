import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../actions";

const TwitchEmbed = ({ channel, ...props }) => {
    const { logo, game, status, text, title, views } = props.embed;
    const { searchGamesApi } = props;
    return (
      <div className="twitchWrapper">
        <div className="twitchStream">
          <iframe
            src={`https://player.twitch.tv/?channel=${channel.name}&parent=${encodeURIComponent('localhost')}`}
            width="100%"
            height="auto"
            frameBorder="0"
            scrolling="no"
            title={title}
          />
          <br />
          <div id="gs-channel-info" className="row">
            <div className="col-sm-7">
              <div className="gs-stream-info">
                <div className="profile-image">
                  <figure className="gs-avatar">
                    <img src={logo} alt="logo" />
                  </figure>
                </div>
                <div className="stream-details">
                  <span className="text-16">{status}</span>
                  <br />
                  <Link
                    to={`/search`}
                    onClick={() => searchGamesApi(game)}
                  >
                    <span className="gs-game">{game}</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-sm-5 text-right">
              <br />
              <span className="gs-views">Total Views: {views}</span>
            </div>
            <div className="col-sm-12" dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        </div>
      </div>
    );
};

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, actions)(TwitchEmbed);
