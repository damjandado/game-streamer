import React, { Component } from 'react';
import { getState } from 'redux';
import { connect } from 'react-redux';
import requestApi from '../../actions/requestApi';
import fetchSuccess from '../../actions/fetchSuccess';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import StreamCard from  '../presentationals/StreamCard';
import Alert from  '../presentationals/Alert';

class Streams extends Component {

  componentDidMount () {
    // this.props.store.subscribe(this.forceUpdate.bind(this));
    console.log('Streams.props:', this.props);
    console.log('fetchUser PROP is:', this.props.fetchUser);
    // this.props.store.dispatch(this.props.requestApi());
    this.props.requestApi();
  }

  render() {
    // const stateProps = this.props.store.getState();
    const twitchProps = this.props.twitch;
    const status = twitchProps.status;
    const streamCardItems = twitchProps.streams.map((stream) =>
      <StreamCard
        key = { stream._id }
        streamCover = { stream.preview.medium }
        streamLink = { stream.channel.url }
      />
    );
    const error = twitchProps.error;
    return (
      <div className="container-fluid main">
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

function mapStateToProps({ twitch }) {
  return { twitch };
}

const mapDispatchToProps = dispatch => {
  return { requestApi: requestApi }
}

export default connect(mapStateToProps, actions)(Streams); 
