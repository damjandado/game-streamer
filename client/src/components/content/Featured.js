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
        key={ft.id}
        ebdStream={ft}
        streamCover={ft.thumbnail_url.replace(/\{width\}|\{height\}/g, '300')}
        title={ft.title}
        text={ft.text}
        logo={ft.thumbnail_url.replace(/\{width\}|\{height\}/g, '300')}
        name={ft.user_name}
        game={ft.game_name}
      />
    ));
    return (
      <div className="main">
        <h3 className="text-center text-muted">Featured Streams</h3>
        {{
          loading: <Loader />,
          success: <div className="row">{streamCardItems}</div>,
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
