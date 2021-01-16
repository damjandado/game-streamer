import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getUser, getStream, searchStreams } from '../../actions';
import { formatImgUrl } from '../../utils';

const TwitchEmbed = ({ channel, ...props }) => {
    const dispatch = useDispatch();
    const { name, user, stream } = channel;
    const { game_id, game_name, title, thumbnail_url, viewer_count } = stream || {};
    const { profile_image_url } = user || {};
    const parent = encodeURIComponent(process.env.REACT_APP_DOMAIN);
    const logo = formatImgUrl(thumbnail_url, '300');

    useEffect(() => {
        if (!stream) {
            dispatch(getStream({ user_login: name }));
        }
        if (!user) {
            dispatch(getUser({ login: name }));
        }
    }, []);

    return (
        <div className="twitchWrapper">
            <div className="twitchStream">
                <iframe
                    src={`https://player.twitch.tv/?channel=${channel.name}&parent=${parent}`}
                    width="100%"
                    height="auto"
                    frameBorder="0"
                    scrolling="no"
                    title={title}
                />
                <div id="gs-channel-info" className="pt-3 px-3">
                    <div className="d-flex justify-between">
                        <div className="gs-stream-info">
                            <div className="profile-image">
                                <figure className="gs-avatar gs-avatar-large">
                                    <img src={profile_image_url} alt="logo" />
                                </figure>
                            </div>
                            <div className="stream-details d-flex flex-col">
                                <span className="text-16">{title}</span>
                                <Link
                                    to={`/search`}
                                    onClick={() => dispatch(searchStreams(game_id, game_name))}
                                >
                                    <span className="gs-game">{game_name}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="gs-views">Total Views: {viewer_count}</span>
                        </div>
                    </div>

                    <div className="gs-desc">{''}</div>
                </div>
            </div>
        </div>
    );
};

export default TwitchEmbed;
