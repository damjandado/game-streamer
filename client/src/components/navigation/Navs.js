import React from 'react';
import { Link } from 'react-router-dom';

const links = [
    ['featured', 'Featured'],
    ['topgames', 'Top Games'],
];

const Navs = () => {
    const route = location.pathname.substring(1);
    const list = links.map((item) => {
        const activeTab = route === item[0] ? 'text-white' : '';
        return (
            <li className="nav-item" key={item[0]}>
                <Link className={`nav-link my-2 my-sm-0 ${activeTab}`} to={`/${item[0]}`}>
                    {item[1]}
                </Link>
            </li>
        );
    });
    return (
        <ul className="navbar-nav mr-sm-2 mr-md-2" role="tablist">
            {list}
        </ul>
    );
};

export default Navs;
