import React, { Component } from "react";

class LeftBar extends Component {
  render() {
    return (
      <div className="col-sm-3 col-md-auto sidenav gs-sidenav">
        <div>
          <h6>Genres</h6>
          <ul>
            <li>
              <a>link g1</a>
            </li>
          </ul>
        </div>
        <div>
          <h6>Categories</h6>
          <ul>
            <li>
              <a>link c1</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default LeftBar;
