import React, { Component } from 'react';
import { connect } from 'react-redux';

// import Header from './Header';

class Channel extends Component {
  /*  if (!video) {
    return <div>Loading...</div>;
  }*/
  componentDidMount() {
    console.log('CHANNEL mounted');
    // twitchEmbed() {
    new window.Twitch.Embed('twitch-embed', {
      width: 854,
      height: 480,
      channel: this.props.embed
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

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps)(Channel);
