import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

class LeftBarItem extends Component {
  activeChannel() {
    this.props.embedStream(this.props.ebdStream);
    this.props.saveActivity(this.props.ebdStream);
  }

  render() {
    const { profileImage, name, game } = this.props;
    return (
      <li className="list-group-item">
        <Link to={`/${name}`} onClick={this.activeChannel.bind(this)}>
          <div className="video-list media">
            <div className="media-left">
              <img className="media-object" src={profileImage} alt="profileImage" />
            </div>
            <div className="media-body">
              <div className="media-heading">{name}</div>
              <div>{game}</div>
            </div>
          </div>
        </Link>
      </li>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, {
  embedStream: actions.embedStream,
  saveActivity: actions.saveActivity
})(LeftBarItem);
