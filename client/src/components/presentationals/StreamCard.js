import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Truncate from 'react-truncate';

import * as actions from '../../actions';
import { formatImgUrl } from '../../utils';

const StreamCard = (props) => {
    const dispatch = useDispatch();
    const [isTruncated, setIsTruncated] = useState(false);

    const handleTruncate = (truncated) => {
        if (isTruncated !== truncated) {
            setIsTruncated(truncated);
        }
    };

    const activeChannel = () => {
        const { stream } = props;
        dispatch(actions.embedStream({ stream, user: stream._user }));
    };

    const { stream } = props;
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
        _user,
    } = stream;
    let userLogo;
    const width = userLogo ? 200 : '100%';
    const streamCover = formatImgUrl(thumbnail_url);
    // const gameImg = formatImgUrl(box_art_url, 188, 250);
    return (
        <div className="stream-card pb-3 col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="gs-video-thumbnail">
                <Link to={`/${user_name}`} onClick={activeChannel}>
                    <img className="stream-cover" src={streamCover} alt={title} style={{ width }} />
                </Link>
            </div>
            <div className="gs-stream-info pt-1">
                <div className="profile-image">
                    <figure className="gs-avatar">
                        <img src={_user?.profile_image_url} alt="logo" />
                    </figure>
                </div>
                <div className="stream-details">
                    <div className="font-weight-bold" data-tip={title}>
                        <Truncate lines={1} ellipsis={<span>...</span>} onTruncate={handleTruncate}>
                            {title}
                        </Truncate>
                    </div>
                    <Link to={`/${user_name}`} onClick={activeChannel}>
                        {user_name}
                    </Link>{' '}
                    plays{' '}
                    <Link
                        to={'/search'}
                        onClick={() => dispatch(actions.searchStreams(game_id, game_name))}
                    >
                        {game_name}
                    </Link>
                </div>
            </div>
            {isTruncated && <ReactTooltip />}
        </div>
    );
};

export default withRouter(StreamCard);
