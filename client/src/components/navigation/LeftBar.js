import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'recompose';

import { withLoading } from '../Hoc';
import LeftBarItem from './LeftBarItem';
import { populateUser } from '../../utils';

const LeftBar = () => {
    const featured = useSelector((state) => state.twitch.featured.list);
    const [recommended, setRecommended] = useState(featured.slice(0, 5));
    useEffect(() => {
        populateUser(featured.slice(0, 5)).then((res) => setRecommended(res));
    }, [featured]);
    return (
        <div className="gs-sidenav d-none d-sm-block">
            <div>
                <h6>Featured Broadcasters</h6>
                <hr className="gs-hr" />
                <ul className="list-group">
                    {recommended.map((stream) => (
                        <LeftBarItem key={stream.id} stream={stream} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

const loadingCondition = ({ featured }) => false;

export default compose(withLoading(loadingCondition))(LeftBar);
