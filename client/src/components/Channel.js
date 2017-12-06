import React, { Component } from 'react';
import { connect } from 'react-redux';

// import Header from './Header';

class Channel extends Component {
  /*  if (!video) {
    return <div>Loading...</div>;
  }*/
  componentDidMount() {
    // twitchEmbed() {
    new window.Twitch.Embed('twitch-embed', {
      width: 854,
      height: 480,
      channel: 'monstercat'
    });
    // }
  }

  render() {
    return (
      <div>
        <br />
        <h3>Twitch Embed</h3>
        <div id="twitch-embed" />
      </div>
    );
  }
}

export default Channel;
