import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchStreamByChannelName } from '../../actions/apiCalls';
import TwitchEmbed from '../presentationals/TwitchEmbed';

class Channel extends Component {
  async componentDidMount() {
    const { match: { params } } = this.props;
    console.log('CHANNEL mounted', this.props);
    console.log('params?', params);
    await this.props.fetchStreamByChannelName(params.channelName);
  }

  render() {
    const { display_name, followers, name } = this.props.embed;
    return (
      <div id="gs-embed">
        <p className="h4">
          {display_name} | Followers: {followers}
        </p>
        <TwitchEmbed channel={name} />
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, { fetchStreamByChannelName })(Channel);
