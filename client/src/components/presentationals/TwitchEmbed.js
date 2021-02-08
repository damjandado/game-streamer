import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, getStream, searchStreams } from '../../actions';

const defaultStream = {
    user_name: 'Monstercat',
    game_name: 'Music',
    title: 'Non Stop Music - Monstercat Radio 🎶',
    thumbnail_url:
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_monstercat-{width}x{height}.jpg',
};

const defaultUser = {
    login: 'monstercat',
    profile_image_url:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/monstercat-profile_image-3e109d75f8413319-300x300.jpeg',
};

const TwitchEmbed = ({ name }) => {
    const dispatch = useDispatch();
    const embed = useSelector((state) => state.embed);
    const { user, stream } = embed || {};
    const { user_name, game_id, game_name, title, viewer_count } = stream || defaultStream;
    const { profile_image_url } = user || defaultUser;
    const parent = encodeURIComponent(process.env.REACT_APP_DOMAIN);

    useEffect(() => {
        if (name && !stream) {
            dispatch(getStream({ user_login: name }));
        }
        if (name && !user) {
            dispatch(getUser({ login: name }));
        }
    }, []);

    return (
        <div className="twitchWrapper">
            <div className="twitchStream">
                <iframe
                    src={`https://player.twitch.tv/?channel=${user_name}&parent=${parent}`}
                    width="100%"
                    height="auto"
                    frameBorder="0"
                    scrolling="no"
                    title={title}
                />
                <div id="gs-channel-info" className="pt-3 px-2">
                    <div className="gs-desc grid">
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
                            {viewer_count && (
                                <span className="gs-views">Total Views: {viewer_count}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwitchEmbed;
