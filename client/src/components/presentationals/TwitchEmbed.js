import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getUser, getStream, searchStreams } from '../../actions';
import { formatImgUrl } from '../../utils';

const TwitchEmbed = ({ channel, ...props }) => {
    const dispatch = useDispatch();
    const { name, user, stream } = channel;
    const { game_id, game_name, title, thumbnail_url, type, viewer_count } = stream || {};
    const { description } = user || {};
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
                <br />
                <div id="gs-channel-info" className="row">
                    <div className="col-sm-7">
                        <div className="gs-stream-info">
                            <div className="profile-image">
                                <figure className="gs-avatar">
                                    <img src={logo} alt="logo" />
                                </figure>
                            </div>
                            <div className="stream-details">
                                <span className="text-16">{type}</span>
                                <br />
                                <Link to={`/search`} onClick={() => dispatch(searchStreams(game_id, game_name))}>
                                    <span className="gs-game">{game_name}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 text-right">
                        <br />
                        <span className="gs-views">Total Views: {viewer_count}</span>
                    </div>
                    <div className="col-12">{description}</div>
                </div>
            </div>
        </div>
    );
};

export default TwitchEmbed;
