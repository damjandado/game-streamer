import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';

class Navs extends Component {
  render() {
    const { featured, top, channel, search } = this.props.activeTab;
    return (
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <Link
            className={'btn btn-outline-success my-2 my-sm-0' + featured}
            to="/featured"
          >
            Featured
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={'btn btn-outline-success my-2 my-sm-0' + top}
            to="/topgames"
          >
            Top Games
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={'btn btn-outline-success my-2 my-sm-0' + channel}
            to={'/' + this.props.embed.name}
          >
            Channel
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={'btn btn-outline-success my-2 my-sm-0' + search}
            to="/search"
          >
            Search Results
          </Link>
        </li>
      </ul>
    );
  }
}

function mapStateToProps({ embed, activeTab }) {
  return { embed, activeTab };
}

export default connect(mapStateToProps, actions)(Navs);
