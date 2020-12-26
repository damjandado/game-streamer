import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Lazy } from 'react-lazy';

import * as actions from '../../actions';

class GameCard extends Component {
    state = { truncated: false };

    showTooltip() {
        if (this.span.offsetWidth > this.info.offsetWidth) {
            this.setState({ truncated: true });
        } else {
            this.setState({ truncated: false });
        }
    }

    render() {
        const { game, ...props } = this.props;
        const { id, name, box_art_url, } = game;
        let trunc = this.state.truncated;
        return (
            <div className='game-card col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2'>
                <div className="gs-video-thumbnail">
                    <Link to={'/search'} onClick={() => props.searchStreams(id)}>
                        <Lazy component="span" cushion={200}>
                            <img
                                className='stream-cover'
                                src={box_art_url.replace(/\{width\}|\{height\}/g, '300')}
                                alt={name}
                            />
                        </Lazy>
                    </Link>
                </div>
                <div className="gs-game-info" ref={(div) => (this.info = div)}>
                    <div className="game-details iffyTip" onMouseOver={this.showTooltip.bind(this)}>
                        <Link to={'/search'} onClick={() => props.searchStreams(id)}>
                            {trunc}
                            <span
                                className="font-weight-bold"
                                data-tip={name}
                                ref={(span) => {
                                    this.span = span;
                                }}
                            >
                                {name}
                            </span>
                            {trunc && (
                                <ReactTooltip
                                    place="bottom"
                                    type="dark"
                                    effect="solid"
                                    offset={{ bottom: 20, right: 50 }}
                                />
                            )}
                        </Link>
                        <div>
                            <span className=".gs-views">viewers: {props.viewers}</span>
                            <br />
                            {props.spanChannels && <span className=".gs-views">channels: {channels}</span>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, actions)(withRouter(GameCard));
