import React from 'react';
import { Link } from 'react-router-dom';
import LoginNew from './LoginNew';

export default ({ children, link }) => {
  console.log('p r o p s link', link);
  return (
    <div className="container">
      <Link to={link}>
        <button type="button" className="btn btn-primary gs-btn">
          {children}
        </button>
      </Link>
    </div>
  );
};
