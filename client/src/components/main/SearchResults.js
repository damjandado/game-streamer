import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

import Loader from "../presentationals/Loader";
import StreamCard from "../presentationals/StreamCard";
import Alert from "../presentationals/Alert";

class SearchResults extends Component {
  render() {
    const searchProps = this.props.search;
    const status = searchProps.status;
    const streamCardUsers = searchProps.users.map(user => (
      <StreamCard
        key={user.id}
        streamCover={user.profile_image_url}
        streamLink={`https://www.twitch.tv/${user.login}`}
        streamChannel={user}
      />
    ));
    const streamCardGames = searchProps.games.map(game => (
      <StreamCard
        key={game._id}
        streamCover={game.preview.medium}
        streamLink={game.channel.url}
        streamChannel={game.channel}
      />
    ));
    const error = searchProps.error;
    return (
      <div className="main">
        {status === "loading" ? (
          <Loader />
        ) : status === "success" ? (
        <div>
          <div className="stream-cards">
            {streamCardUsers}
          </div>
          <div className="stream-cards">
            {streamCardGames}
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
    );
  }
}

function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps, actions)(SearchResults);
