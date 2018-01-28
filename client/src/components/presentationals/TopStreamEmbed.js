import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import * as apiCalls from '../../actions/apiCalls';

import FrontGames from './FrontGames';

const TopStreamEmbed = props => {
  if (!props.featured.featured[0]) return <div>Loading...</div>;

  const { text, title, stream } = props.featured.featured[0];
  const { logo, name, display_name, game } = stream.channel;

  const activeChannel = () => {
    props.embedStream(stream);
    props.saveActivity(stream);
  };

  const searchGame = () => {
    props.searchGamesApi({ search: game });
  };

  const renderText = () => {
    return { __html: text };
  };

  return (
    <div className="twitchWrapper">
      <div className="topStream">
        <iframe
          src={`https://player.twitch.tv/?channel=${name}`}
          width="100%"
          height="auto"
          frameBorder="0"
          scrolling="no"
          title={title}
        />
        <br />
        <div id="gs-channel-info" className="row">
          <div className="col-sm-10">
            <div className="gs-stream-info">
              <div className="profile-image">
                <figure className="gs-avatar-40 gs-figure">
                  <img src={logo} alt="logo" />
                </figure>
              </div>
              <div className="stream-details text-12">
                <span className="font-weight-bold text-14">{title}</span>
                <br />
                <Link to={`/${name}`} onClick={activeChannel.bind(this)}>
                  {display_name}
                </Link>{' '}
                plays{' '}
                <Link to={'/search'} onClick={searchGame.bind(this)}>
                  {game}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-2 text-right">
            <br />
          </div>
          <div
            className="col-sm-12 text-12"
            dangerouslySetInnerHTML={renderText()}
          />
          <div className="col-sm-12">
            <FrontGames gprop={props.gprop} />
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ embed, featured }) {
  return { embed, featured };
}

export default connect(mapStateToProps, {
  embedStream: actions.embedStream,
  saveActivity: actions.saveActivity,
  searchGamesApi: apiCalls.searchGamesApi
})(TopStreamEmbed);
