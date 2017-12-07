import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Featured from './containers/Featured';
import Channel from './Channel';
// import _ from "lodash";
// import 'twitch-embed';
      
class Landing extends Component {

  render() {
/*    const twitchEmbed = _.debounce(() => {
      this.twitchEmbed();
    }, 5000);
    twitchEmbed();*/
    console.log('LANDING props are', this.props);
    return (
      <div className="container-fluid col-sm-10">
        <ul className="nav nav-pills" role="tablist">
          <li className="nav-item" onClick={() => this.props.toggleActive(this.props.activeTab.featured)}>
            <Link className={"nav-link" + (this.props.activeTab.featured ? " active" : "")} to="/">
              Featured
            </Link>
          </li>
          <li className="nav-item" onClick={() => this.props.toggleActive(this.props.activeTab.channel)}>
            <Link className={"nav-link" + (this.props.activeTab.channel ? " active" : "")} to={"/" + this.props.embed}>
              Channel
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          <div className="container-fluid tab-pane active">
            <Route exact path="/" component={Featured} />
            <Route path={"/" + this.props.embed} component={Channel} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed, activeTab }) {
  return { embed, activeTab };
}

export default connect(mapStateToProps, actions)(Landing);
