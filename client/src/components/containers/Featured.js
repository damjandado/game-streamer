import React, { Component } from 'react';
import { getState } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import StreamCard from  '../presentationals/StreamCard';
import Alert from  '../presentationals/Alert';

class Featured extends Component {

  componentWillMount () {
    // this.props.store.subscribe(this.forceUpdate.bind(this));
    this.props.featuredApi();
  }
  componentDidMount () {
    // this.props.store.subscribe(this.forceUpdate.bind(this));
    this.props.featuredApi();
  }

  render() {
    // const stateProps = this.props.store.getState();
    const featuredProps = this.props.featured;
    const status = featuredProps.status;
    const streamCardItems = featuredProps.streams.map((stream) =>
      <StreamCard
        key = { stream._id }
        streamCover = { stream.preview.medium }
        streamLink = { stream.channel.url }
        streamChannel = { stream.channel }
      />
    );
    const error = featuredProps.error;
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

function mapStateToProps({ featured }) {
  return { featured };
}

export default connect(mapStateToProps, actions)(Featured); 
