import React from 'react';
import { Link } from 'react-router-dom';

export default ({ children, link }) => {
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
