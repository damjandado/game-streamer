import React from 'react';
import LoginNew from './LoginNew';

export default () => {
  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#myModal"
      >
        Log In
      </button>
      <div className="modal fade" id="myModal">
        <LoginNew />
      </div>
    </div>
  );
};
