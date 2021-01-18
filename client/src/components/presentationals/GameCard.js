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

    const { game } = props;
    const { id, name, box_art_url } = game;
    return (
        <div className="game-card pb-3 col">
            <div className="gs-video-thumbnail">
                <Link to={'/search'} onClick={() => dispatch(actions.searchStreams(id, name))}>
                    <img
                        className="stream-cover"
                        src={formatImgUrl(box_art_url, 188, 250)}
                        alt={name}
                    />
                </Link>
            </div>
            <div className="gs-game-info pt-1">
                <div className="game-details iffyTip w-full">
                    <Link
                        className="block w-full"
                        to={'/search'}
                        onClick={() => dispatch(actions.searchStreams(id, name))}
                    >
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
                </div>
            </div>
            {isTruncated && <ReactTooltip />}
        </div>
    );
};

export default withRouter(GameCard);
