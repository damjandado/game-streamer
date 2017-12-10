import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import StreamCard from  '../presentationals/StreamCard';
import Alert from  '../presentationals/Alert';

class TopGames extends Component {
  componentDidMount () {
    this.props.topGamesApi();
  }

  render() {
    const topGamesProps = this.props.topGames;
    const status = topGamesProps.status;
    const streamCardItems = topGamesProps.games.map((game) =>
      <StreamCard
        key = { game._id }
        streamCover = { game.box.medium }
        streamLink = { null }
        streamChannel = { game }
      />
    );
    const error = topGamesProps.error;
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

function mapStateToProps({ topGames }) {
  return { topGames };
}

export default connect(mapStateToProps, actions)(TopGames); 
