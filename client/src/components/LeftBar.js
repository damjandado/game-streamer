import React, { Component } from 'react';

// import Header from './Header';
// import Streams from './containers/Streams';

//top level of React component hierarchy
class LeftBar extends Component {
  render() {
    return (
        <div className="col-sm-2 sidenav gs-sidenav">
          <div>
            <h6>Genres</h6>
            <ul>
              <li><a>link g1</a></li>
            </ul>
          </div>
          <div>
            <h6>Categories</h6>
            <ul>
              <li><a>link c1</a></li>
            </ul>
          </div>


          {/*<SideNav />*/}
        </div>
    );
  }
}

export default LeftBar;