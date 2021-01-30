import React from 'react';
import { Link } from 'react-router-dom';

export default ({ children, link }) => {
    return (
        <Link to={link} className="nav-link">
            {children}
        </Link>
    );
};
