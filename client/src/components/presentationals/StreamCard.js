import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Lazy } from 'react-lazy';

import * as actions from '../../actions';
import { formatImgUrl } from '../../utils';
class StreamCard extends Component {
    activeChannel() {
        const { stream } = this.props;
        this.props.embedStream({ stream });
        this.props.saveActivity(stream);
    }

    render() {
        const { stream, ...props } = this.props;
        const {
            game_id,
            game_name,
            id,
            started_at,
            thumbnail_url,
            title,
            user_id,
            user_name,
            viewer_count,
            ...streamProps
        } = stream;
        let userLogo;
        const width = userLogo ? 200 : '100%';
        const streamCover = formatImgUrl(thumbnail_url, '300');
        const gameImg = formatImgUrl(streamProps.box_art_url, '300');
        return (
            <div className="stream-card col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                <div className="gs-video-thumbnail">
                    <Link to={`/${user_name}`} onClick={this.activeChannel.bind(this)}>
                        <Lazy component="span" cushion={200}>
                            <img className="stream-cover" src={streamCover} alt={title} style={{ width }} />
                        </Lazy>
                    </Link>
                </div>
                <div className="gs-stream-info">
                    <div className="profile-image">
                        <figure className="gs-avatar">
                            <img src={gameImg} alt="logo" />
                        </figure>
                    </div>
                    <div className="stream-details">
                        <span className="font-weight-bold">{title}</span>
                        <br />
                        <Link to={`/${user_name}`} onClick={this.activeChannel.bind(this)}>
                            {user_name}
                        </Link>{' '}
                        plays{' '}
                        <Link to={'/search'} onClick={() => props.searchStreams(game_id)}>
                            {game_name}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, actions)(withRouter(StreamCard));
