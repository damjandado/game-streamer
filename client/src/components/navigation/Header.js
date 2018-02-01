import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SearchForm from './SearchForm';
import AuthButton from './AuthButton';
import Navs from './Navs';
import { onLogout } from '../../actions/actions';

import logo from '../../images/logo_ticc_b.png';

class Header extends Component {
  state = { dropdownActive: false };

  renderContent() {
    switch (this.props.auth.authenticated) {
      case null:
        return;
      case false:
        return [
          <li key={'login'} className="nav-item">
            <AuthButton link={'/login'}>Log in</AuthButton>
          </li>,
          <li key={'signup'} className="nav-item">
            <AuthButton link={'/signup'}>Sign up</AuthButton>
          </li>
        ];
      default:
        return (
          <li className="nav-item">
            <div className="dropdown">
              <button className="dropbtn">
                {this.props.auth.user.name}{'  '}
                <i className="fa fa-caret-down" />
              </button>
              <div className="dropdown-content bg">
                <a
                  id="gs-logout"
                  className="nav-link text-center"
                  onClick={this.props.onLogout}
                >
                  Log out
                </a>
              </div>
            </div>
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
              <img
                src={logo}
                id="gs-logo"
                className="d-inline-block align-top"
              />
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <Navs />
            <SearchForm />
            <ul className="navbar-nav ml-auto">{this.renderContent()}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, { onLogout })(Header);
