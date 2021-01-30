import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SearchForm from './SearchForm';
import AuthButton from './AuthButton';
import Navs from './Navs';

import logo from '../../images/logo_ticc_b.png';

const Header = () => {
    const [dropdownActive, setDropdownActive] = useState(false);

    const renderContent = () => {
        const auth = useSelector((state) => state.auth);
        const { authenticated, user } = auth;
        switch (authenticated) {
            case null:
                return;
            case false:
                return [
                    <li key={'login'} className="nav-item">
                        <AuthButton link={'/login'}>Log in</AuthButton>
                    </li>,
                    <li key={'signup'} className="nav-item">
                        <AuthButton link={'/signup'}>Sign up</AuthButton>
                    </li>,
                ];
            default:
                return (
                    <li className="nav-item">
                        <div className="dropdown">
                            <button className="dropbtn">
                                {user.name || user.username}
                                {'  '}
                                <i className="fa fa-caret-down" />
                            </button>
                            <div className="dropdown-content bg">
                                <a
                                    id="gs-logout"
                                    className="nav-link text-center text-white"
                                    href={`${process.env.REACT_APP_SERVER_URL}/api/logout`}
                                >
                                    Log out
                                </a>
                            </div>
                        </div>
                    </li>
                );
        }
    };

    const onExpand = () => {
        setDropdownActive(!dropdownActive);
    };

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
                        onClick={onExpand}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <Link id="game-streamer" className="navbar-brand" to="/">
                        <img
                            src={logo}
                            id="gs-logo"
                            className="d-inline-block align-top"
                            alt="logo"
                        />
                    </Link>
                </div>
                <div
                    className={`${
                        dropdownActive ? '' : 'd-none'
                    } pl-3 pl-sm-0 sm:pl-0 navbar-collapse`}
                    id="navbarSupportedContent"
                >
                    <Navs />
                    <SearchForm />
                    <ul className="navbar-nav ml-auto">{renderContent()}</ul>
                </div>
            </div>
        </nav>
    );
};

export default withRouter(Header);
