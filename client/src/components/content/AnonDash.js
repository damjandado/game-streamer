import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import VideoCard from '../presentationals/VideoCard';
import TopStreamEmbed from '../presentationals/TopStreamEmbed';
import FrontGames from '../presentationals/FrontGames';

class AnonDash extends Component {
  componentDidMount() {
    this.props.fetchStreamAndClips('Twitch', 2);
    this.props.topGamesApi(12);
  }

  render() {
    const { clips } = this.props;
    const clipCards = clips.clips.map(cl => {
      if (cl !== null)
        return <VideoCard key={cl.slug} iframe={cl.embed_html} />;
    });
    return (
      <div className="row">
        <div className="col-xl-8">
          <TopStreamEmbed gprop={this.props.topGames} />
          <div className="col-sm-12 most-pop-games">
            <hr className="mt-0 mb-4" />
            <h3 className="text-center text-muted">Most Popular Games</h3>
            <FrontGames gprop={this.props.gprop} />
          </div>
        </div>
        <div className="col-xl-4 d-none d-xl-block">
          <div className="row">{clipCards}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ clips, featured, topGames, dashboard }) {
  return { clips, featured, topGames, dashboard };
}

export default connect(
  mapStateToProps,
  actions
)(AnonDash);
