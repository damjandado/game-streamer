import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as apiCalls from "../../actions/apiCalls";

import TopStreamEmbed from "../presentationals/TopStreamEmbed";
import VideoCard from "../presentationals/VideoCard";
import Loader from "../presentationals/Loader";
import Alert from "../presentationals/Alert";

class AnonDash extends Component {
  componentDidMount() {
    this.props.fetchStreamAndClips('Twitch', 3);
    this.props.topGamesApi();
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
    return (
      <div className="row">
        <div className="gs-col-left">
          {" "}
          {status === "loading" ? (
            <Loader />
          ) : status === "success" ? (
            <div>
              <div className="stream-cards">{clipCards}</div>
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

function mapStateToProps({ clips, featured, topGames }) {
  return { clips, featured, topGames };
}

export default connect(mapStateToProps, apiCalls)(AnonDash);
