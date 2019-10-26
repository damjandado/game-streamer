import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'recompose';
import { withLoading } from '../Hoc';

import LeftBarItem from "./LeftBarItem";

class LeftBar extends Component {
  renderItems() {
    let { featured } = this.props;
    const fts = featured.slice(0, 5);
    return fts.map(item => {
      return (
        <LeftBarItem
          key={item.id}
          // profileImage={item.stream.channel.logo}
          name={item.user_name}
          // game={item.stream.channel.game}
          ebdStream={item}
        />
      );
    });
  }

  render() {
    return (
      <div className="d-none d-sm-block col-sm-3 col-md-auto sidenav gs-sidenav">
        <div>
          <h6>Featured Broadcasters</h6>
          <hr className="gs-hr" />
          <ul className="list-group">{this.renderItems()}</ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ twitch: { featured } }) {
  return { featured: featured.list };
}

let loadingCondition = ({ featured }) => !featured;

export default compose(
    connect(mapStateToProps),
    withLoading(loadingCondition),
)(LeftBar);
