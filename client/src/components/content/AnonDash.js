import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import TopStreamEmbed from "../presentationals/TopStreamEmbed";
import VideoCard from "../presentationals/VideoCard";
import Loader from "../presentationals/Loader";
import Alert from "../presentationals/Alert";

class AnonDash extends Component {
  componentDidMount() {
    this.props.fetchStreamAndClips("Twitch", 4);
    this.props.topGamesApi(12);
  }

  render() {
    const anonProps = this.props.clips;
    const status = anonProps.status;
    const clipCards = anonProps.clips.map(cl => {
      if (cl !== null)
        return (
          <VideoCard
            key={cl.slug}
            ebdStream={cl}
            title={cl.title}
            iframe={cl.embed_html}
            logo={cl.broadcaster.logo}
            name={cl.broadcaster.name}
            displayName={cl.broadcaster.display_name}
            game={cl.game}
            slug={cl.slug}
            thumbnail={cl.thumbnails.medium}
            duration={cl.duration}
            curator={cl.curator}
          />
        );
    });
    console.log("clipCards", clipCards);
    const error = anonProps.error;
    const ds = this.props.dashboard;
    return (
      <div className="row">
        <div
          className="gs-col-left"
          style={{
            height:
              ds.divHeight + ds.frameHeight > document.body.offsetHeight
                ? ds.divHeight + ds.frameHeight
                : document.body.offsetHeight
          }}
        >
          {" "}
          {status === "loading" ? (
            <Loader />
          ) : status === "success" ? (
            <div>
              <div className="stream-cards" style={{ marginTop: 0 }}>
                {clipCards}
              </div>
            </div>
          ) : status === "error" ? (
            <div>
              <Alert error={error} />
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="gs-col-right col-md-auto">
          <TopStreamEmbed gprop={this.props.topGames} />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ clips, featured, topGames, dashboard }) {
  return { clips, featured, topGames, dashboard };
}

export default connect(
  mapStateToProps,
  actions
)(AnonDash);
