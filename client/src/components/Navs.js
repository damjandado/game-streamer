import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/actions";

class Navs extends Component {
  render() {
    return (
      <ul className="nav nav-pills" role="tablist">
        <li
          className="nav-item"
          onClick={() => this.props.toggleActive("featured")}
        >
          <Link
            className={
              "btn btn-outline-success my-2 my-sm-0" +
              (this.props.activeTab.featured ? " active" : "")
            }
            to="/featured"
          >
            Featured
          </Link>
        </li>
        <li className="nav-item" onClick={() => this.props.toggleActive("top")}>
          <Link
            className={
              "btn btn-outline-success my-2 my-sm-0" +
              (this.props.activeTab.top ? " active" : "")
            }
            to="/topgames"
          >
            Top Games
          </Link>
        </li>
        <li
          className="nav-item"
          onClick={() => this.props.toggleActive("channel")}
        >
          <Link
            className={
              "btn btn-outline-success my-2 my-sm-0" +
              (this.props.activeTab.channel ? " active" : "")
            }
            to={"/" + this.props.embed.name}
          >
            Channel
          </Link>
        </li>
        <li
          className="nav-item"
          onClick={() => this.props.toggleActive("search")}
        >
          <Link
            className={
              "btn btn-outline-success my-2 my-sm-0" +
              (this.props.activeTab.search ? " active" : "")
            }
            to="/search"
          >
            Search Results
          </Link>
        </li>
      </ul>
    );
  }
}

function mapStateToProps({ embed, activeTab }) {
  return { embed, activeTab };
}

export default connect(mapStateToProps, actions)(Navs);
