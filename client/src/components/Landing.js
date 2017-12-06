import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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
          <li className="nav-item">
            <Link className="nav-link active" data-toggle="pill" to="/">
              Featured
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" data-toggle="pill" to={"/" + this.props.embed}>
              Channel
            </Link>
          </li>
        </ul>

        <div className="tab-content">
          <div id="home" className="container-fluid tab-pane active">
          <Switch>
            <Route exact path="/" component={Featured} />
            <Route path={"/" + this.props.embed} component={Channel} />
          </Switch>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps)(Landing);
