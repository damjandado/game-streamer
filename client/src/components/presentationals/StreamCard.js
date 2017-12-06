import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

//Presentational React Component
class StreamCard extends Component {
  render() {
    return (
      <div className="stream-cards" onClick={() => this.props.embedStream(this.props.streamChannel)}>
        <a href={'#menu1'}>
          <img className="stream-cover" src={this.props.streamCover} />
        </a>
      </div>
    );
  }
}

export default connect(null, actions)(StreamCard);
