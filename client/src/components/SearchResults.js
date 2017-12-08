import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Loader from './presentationals/Loader';
import StreamCard from  './presentationals/StreamCard';
import Alert from  './presentationals/Alert';

class SearchResults extends Component {
  render() {
    // const stateProps = this.props.store.getState();
    const searchGamesProps = this.props.search;
    const status = searchGamesProps.status;
    const streamCardItems = searchGamesProps.games.map((game) =>
      <StreamCard
        key = { game._id }
        streamCover = { game.preview.medium }
        streamLink = { game.channel.url }
        streamChannel = { game.channel.name }
      />
    );
    const error = searchGamesProps.error;
    return (
      <div className="main">
      {status === "loading" ? (
         <Loader />
       ) : (
          status === "success" ? (
            <div className="stream-cards">
            {streamCardItems}
            </div>
          ) : (
            status === "error" ? (
              <div>
                <Alert error = { error } />
              </div>
            ) : (
              <div></div>
            )
          )
        )
      }
      </div>
    )
  }
}

function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps, actions)(SearchResults); 
