import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as apiCalls from '../actions/apiCalls';

import SearchForm from './SearchForm';
import Login from './Login';
import Navs from './Navs';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <Login />
          </li>
        );
      default:
        return (
          <li>
            <a href="/api/logout">Logout</a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav id="gs-header" className="bg navbar navbar-expand-sm navbar-toggleable-md navbar-light bg-faded">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <a id="game-streamer" className="navbar-brand" href="/">
              GameStreamer
            </a>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li>
                <Navs />
              </li>
            </ul>
            <SearchForm />
          </div>

          <div className="collapse navbar-collapse">
            <ul className="ml-auto">{this.renderContent()}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, apiCalls)(Header);
