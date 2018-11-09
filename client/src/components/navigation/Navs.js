import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/actions";

class Navs extends Component {
  render() {
    const { featured, top, channel } = this.props.activeTab;
    const { name } = this.props.embed;
    return (
      <ul className="navbar-nav mr-sm-4" role="tablist">
        <li className="nav-item">
          <Link className={`nav-link my-2 my-sm-0 text-white ${featured}`} to="/featured">
            Featured
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link my-2 my-sm-0 text-white ${top}`} to="/topgames">
            Top Games
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link my-2 my-sm-0 text-white ${channel}`}
            to={"/" + name || "monstercat"}
          >
            Channel
          </Link>
        </li>
      </ul>
    );
  }
}

function mapStateToProps({ embed, activeTab }) {
  return { embed, activeTab };
}

export default connect(
  mapStateToProps,
  actions
)(Navs);
