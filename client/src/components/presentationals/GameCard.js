import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Truncate from 'react-truncate';

import * as actions from '../../actions';
import { formatImgUrl } from '../../utils';

const GameCard = (props) => {
    const dispatch = useDispatch();
    const [isTruncated, setIsTruncated] = useState(false);

    const handleTruncate = (truncated) => {
        if (isTruncated !== truncated) {
            setIsTruncated(truncated);
        }
    };

    const { game, spanChannels, channels, viewers } = props;
    const { id, name, box_art_url } = game;
    return (
        <div className="game-card pb-2 col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <div className="gs-video-thumbnail">
                <Link to={'/search'} onClick={() => dispatch(actions.searchStreams(id, name))}>
                    <img
                        className="stream-cover"
                        src={formatImgUrl(box_art_url, 188, 250)}
                        alt={name}
                    />
                </Link>
            </div>
            <div className="gs-game-info">
                <div className="game-details iffyTip w-full">
                    <Link className='block w-full' to={'/search'} onClick={() => dispatch(actions.searchStreams(id, name))}>
                        <div className="font-weight-bold" data-tip={name}>
                            <Truncate
                                lines={1}
                                ellipsis={<span>...</span>}
                                onTruncate={handleTruncate}
                            >
                                {name}
                            </Truncate>
                        </div>
                    </Link>
                    <div>
                        <span className=".gs-views">viewers: {viewers}</span>
                        <br />
                        {spanChannels && <span className=".gs-views">channels: {channels}</span>}
                    </div>
                </div>
            </div>
            {isTruncated && <ReactTooltip />}
        </div>
    );
};

export default withRouter(GameCard);
