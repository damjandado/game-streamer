import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TwitchEmbed from '../presentationals/TwitchEmbed';
import { saveActivity } from '../../actions';

const Channel = ({ match }) => {
    const dispatch = useDispatch();
    const embed = useSelector((state) => state.embed);
    const { stream } = embed;
    const name = stream?.user_name || match.params.channelName;
    useEffect(() => {
        dispatch(saveActivity(stream));
    }, []);
    return (
        <div id="gs-embed">
            <h3 className="text-center text-muted mb-4">
                You are watching <span className="text-info">{name}</span> channel
            </h3>
            <TwitchEmbed channel={{ ...embed, name }} />
        </div>
    );
};

export default Channel;
