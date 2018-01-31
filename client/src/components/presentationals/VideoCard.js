import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';

//Presentational React Component
class VideoCard extends Component {
  activeChannel() {
    // this.props.embedStream(this.props.ebdStream);
    this.props.saveActivity(this.props.ebdStream);
  }

  searchGame() {
    this.props.searchGamesApi({ search: this.props.game });
  }

  iframe() {
    let iframeCustom = this.props.iframe.replace('tt_content=embed', 'tt_content=embed&autoplay=false');
    // const srcUrl = /src='(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'/;
    iframeCustom = iframeCustom.replace('width=\'640\' height=\'360\'', 'width=\'100%\' height=\'100%\'');
    console.log('iframeCustom', iframeCustom);
    return { __html: iframeCustom }
  }

  render() {
    const { logo, title, name, game } = this.props;
    return (
      <div className="gs-video-card">
        <div className="gs-clip" dangerouslySetInnerHTML={this.iframe()} />
        <div className="gs-stream-info">
          <div className="profile-image">
            <figure className="gs-avatar">
              <img src={logo} alt={title} />
            </figure>
          </div>
          <div className="gs-stream-details">
            <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
              {name}
            </Link>{' '}
            <br />
            <span className="font-weight-bold">{title}</span>
            <br />
            <Link to={'/search'} onClick={this.searchGame.bind(this)}>
              {game}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(VideoCard);
