import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from "lodash";

import TwitchEmbed from '../TwitchEmbed';

class Channel extends Component {
  componentDidMount() {
    console.log('CHANNEL mounted', this.props);
  }

  render() {
    return (
      <div id="gs-embed">
        <h3>{this.props.embed.name}</h3>
        <TwitchEmbed channel={this.props.embed.name} />
        <h5>{this.props.embed.status}</h5>
        <h5>{this.props.embed.game}</h5>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps)(Channel);
