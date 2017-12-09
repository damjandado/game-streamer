import React, { Component } from 'react';
import { connect } from 'react-redux';


class Channel extends Component {
  /*  if (!video) {
    return <div>Loading...</div>;
  }*/
  componentDidMount() {
    console.log('CHANNEL mounted');
    console.log(this.props.embed);
    // twitchEmbed() {
    new window.Twitch.Embed('twitch-embed', {
      width: 1300,
      height: 540,
      channel: this.props.embed.name ? this.props.embed.name : 'monstercat'
    });
    // }
  }

  render() {
    return (
      <div id="gs-embed">
        <h3>{this.props.embed.name}</h3>
        <div id="twitch-embed" />
        <h5>{this.props.embed.status}</h5>
        <h5>{this.props.embed.game}</h5>
        <h5>{this.props.embed.id}</h5>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps)(Channel);
