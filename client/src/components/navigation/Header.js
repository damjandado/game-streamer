import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SearchForm from './SearchForm';
import AuthButton from './AuthButton';
import Navs from './Navs';
import { onLogout } from '../../actions/actions';

class Header extends Component {
  renderContent() {
    switch (this.props.auth.authenticated) {
      case null:
        return;
      case false:
        return (
          [<li key={'login'}>
            <AuthButton link={'/login'}>Log in</AuthButton>
          </li>,
          <li key={'signup'}>
            <AuthButton link={'/signup'}>Sign up</AuthButton>
          </li>]
        );
      default:
        return (
          <li>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.props.onLogout}
              >
                Log out
              </button>
          </li>
        );
    }
  }

  render() {
    return (
      <nav
        id="gs-header"
        className="bg navbar navbar-expand-sm navbar-toggleable-md navbar-light bg-faded"
      >
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
            <ul className="navbar-nav ml-auto">{this.renderContent()}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({auth}) {
  return {auth};
}

export default connect(mapStateToProps, { onLogout })(Header);