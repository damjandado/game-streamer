import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import StreamCard from  '../presentationals/StreamCard';
import Alert from  '../presentationals/Alert';

class Featured extends Component {
  componentDidMount () {
    this.props.featuredApi();
    console.log('FT', this.props);
  }

  render() {
    const ftProps = this.props.featured;
    const status = ftProps.status;
    const streamCardItems = ftProps.featured.map((ft) =>
      <StreamCard
        key = { ft.stream._id }
        title = { ft.title }
        text = { ft.text }
        logo = { ft.stream.channel.logo }
        name = { ft.stream.channel.display_name }
        game = { ft.stream.game }
        streamCover = { ft.stream.preview.medium }
        streamLink = { ft.stream.channel.url }
        streamChannel = { ft.stream.channel }
      />
    );
    const error = ftProps.error;
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
