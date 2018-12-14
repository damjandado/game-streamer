import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Loader from "../presentationals/Loader";
import StreamCard from "../presentationals/StreamCard";
import Alert from "../presentationals/Alert";

class Featured extends Component {
  componentDidMount() {
    this.props.featuredApi(100);
  }

  render() {
    const { featured } = this.props;
    const { status } = featured;
    const streamCardItems = featured.list.map(ft => (
      <StreamCard
        key={ft.stream._id}
        ebdStream={ft}
        streamCover={ft.stream.preview.medium}
        title={ft.title}
        text={ft.text}
        logo={ft.stream.channel.logo}
        name={ft.stream.channel.name}
        game={ft.stream.game}
      />
    ));
    return (
      <div className="main">
        <h3 className="text-center text-muted">Featured Streams</h3>
        {{
          loading: <Loader />,
          1: <div className="row">{streamCardItems}</div>,
          error: <Alert error={status} />,
        }[status]}
      </div>
    );
  }
}

function mapStateToProps({ twitch }) {
  return { featured: twitch.featured };
}

export default connect(
  mapStateToProps,
  actions
)(Featured);
