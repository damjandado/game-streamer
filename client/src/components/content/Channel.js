import React from 'react';
import { useSelector } from 'react-redux';

import TwitchEmbed from '../presentationals/TwitchEmbed';

const Channel = ({ match }) => {
    const embed = useSelector((state) => state.embed);
    const { stream } = embed;
    const name = stream?.user_name || match.params.channelName;
    return (
        <div id="gs-embed">
            <h3 className="text-center text-muted mb-4">
                You are watching{' '}
                <span className="text-info">
                    {name}
                </span>{' '}
                channel
            </h3>
            <TwitchEmbed channel={{ ...embed, name }} />
        </div>
    );
};

export default Channel;
