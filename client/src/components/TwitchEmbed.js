import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const TwitchEmbed = props => {
  const { logo, game, name, status, display_name, text, views } = props.embed;
  const renderText = () => {
    return { __html: text };
  };
  return (
    <div className="twitchWrapper">
      <div className="twitchStream">
        <iframe
          src={`https://player.twitch.tv/?channel=${name}`}
          width="100%"
          height="auto"
          frameBorder="0"
          scrolling="no"
        />
        <br />
        <div id="gs-channel-info" className="row">
          <div className="col-sm-7">
            <div className="gs-stream-info">
              <div className="profile-image">
                <figure className="gs-avatar">
                  <img src={logo} />
                </figure>
              </div>
              <div className="stream-details">
                <span className="text-16">{status}</span>
                <br />
                <Link to={`/search`}>
                  <span className="gs-game">{game}</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-5 text-right">
            <br />
            <span className="gs-views">Total Views: {views}</span>
          </div>
          <div className="col-sm-12" dangerouslySetInnerHTML={renderText()} />
        </div>
      </div>
      <div className="twitchChat">
        <iframe
          src={`https://www.twitch.tv/${name}/chat`}
          width="300"
          height="150"
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </div>
  );
};

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps)(TwitchEmbed);
