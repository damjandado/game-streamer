import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { embedStream, saveActivity } from '../../actions';
import { formatImgUrl } from '../../utils';

const LeftBarItem = ({ stream }) => {
    const dispatch = useDispatch();
    const activeChannel = () => {
        dispatch(embedStream({ stream, user: stream._user }));
        dispatch(saveActivity(stream));
    };

    const { _user, user_name, game_name } = stream;
    return (
        <li className="list-group-item">
            <Link to={`/${user_name}`} onClick={activeChannel}>
                <div className="video-list media">
                    <div className="media-left">
                        <img className="media-object" src={_user?.profile_image_url} alt="profileImage" />
                    </div>
                    <div className="media-body">
                        <div className="media-heading">{user_name}</div>
                        <div>{game_name}</div>
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default LeftBarItem;
