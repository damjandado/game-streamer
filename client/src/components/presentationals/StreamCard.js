import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';

//Presentational React Component
class StreamCard extends Component {
  activeChannel() {
    this.props.embedStream(this.props.streamChannel);
    this.props.toggleActive(false);
  }

  render() {
    return (
      <div className="stream-cards" onClick={this.activeChannel.bind(this)}>
        <Link to={`/${this.props.streamChannel}`}>
          <img className="stream-cover" src={this.props.streamCover} />
        </Link>
      </div>
    );
  }
}

export default connect(null, actions)(StreamCard);
