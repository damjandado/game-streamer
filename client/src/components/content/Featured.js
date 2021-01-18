import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../actions';
import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import Alert from '../presentationals/Alert';

const Featured = () => {
    const { featured } = useSelector((state) => state.twitch);
    const { twitchAccessToken } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    useEffect(() => {
        twitchAccessToken && dispatch(actions.featuredApi(100));
    }, [twitchAccessToken]);

    const { status } = featured;
    const streamCardItems = featured.list.map((item) => <StreamCard key={item.id} stream={item} />);
    return (
        <div className="main">
            <h3 className="text-center text-muted mb-3">Featured Streams</h3>
            {
                {
                    loading: <Loader />,
                    success: <div className="row stream-cards">{streamCardItems}</div>,
                    error: <Alert error={status} />,
                }[status]
            }
        </div>
    );
};

export default Featured;
