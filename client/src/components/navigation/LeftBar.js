import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftBarItem from './LeftBarItem';

class LeftBar extends Component {
  renderItems() {
    return this.props.featured.map(item => {
      return (
        <LeftBarItem
          key={item.stream.channel.display_name}
          profileImage={item.stream.channel.logo}
          name={item.stream.channel.display_name}
          game={item.stream.channel.game}
          ebdStream={item}
        />
      );
    });
  }

  render() {
    return (
      <div className="col-sm-3 col-md-auto sidenav gs-sidenav">
        <div>
          <h6>Featured Broadcasters</h6>
          <hr className="gs-hr" />
          <ul className="list-group">{this.renderItems()}</ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ featured }) {
  return { featured: featured.featured };
}

export default connect(mapStateToProps)(LeftBar);
