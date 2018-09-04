import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../actions";
import TwitchEmbed from "../presentationals/TwitchEmbed";
import Loader from "../presentationals/Loader";
import NotFound from "../presentationals/NotFound";

class Channel extends Component {
  state = { active: false, errorPage: false };

  async componentDidMount() {
    console.log("Channel mounted", this.props);
    this.setState({ active: false });
    this.props.toggleActive("channel");
    const {
      match: { params },
      fetchStreamByChannelName
    } = this.props;
    console.log("params?", params);
    if (params.channelName !== "undefined") {
      await fetchStreamByChannelName(params.channelName);
      if (this.props.embed.found) {
        this.setState({ active: true });
      } else {
        this.setState({ errorPage: true });
      }
    } else {
      await fetchStreamByChannelName("monstercat");
      this.setState({ active: true });
    }
  }

  render() {
    const { display_name, followers, name } = this.props.embed;
    return this.state.active ? (
      <div id="gs-embed">
        <h3 className="text-center text-muted mb-4">
          You are watching{" "}
          <i className="text-info">
            {display_name}
            's
          </i>{" "}
          channel
        </h3>
        <p className="h4">
          {display_name} | Followers: {followers}
        </p>
        <TwitchEmbed channel={name} />
      </div>
    ) : this.state.errorPage ? (
      <NotFound />
    ) : (
      <Loader />
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(
  mapStateToProps,
  actions
)(Channel);
