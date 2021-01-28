import React from 'react';
import { useSelector } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';
import TwitchEmbed from '../presentationals/TwitchEmbed';

const Dashboard = () => {
    const { auth, twitch } = useSelector(({ auth, twitch }) => ({ auth, twitch }));
    const { dashboard } = twitch;
    if (!auth.authenticated)
        return (
            <div className="mainPage row">
                <div className="col">
                    <TwitchEmbed />
                </div>
            </div>
        );

    const { status, streams, games } = dashboard;
    const streamCardStreams = streams.map((bc) => <StreamCard key={bc.id} stream={bc} />);
    const streamCardGames = games.map((gm) => <GameCard key={gm.id} game={gm} />);
    const Dashboard = (
        <>
            <h3 className="text-center text-muted mb-3">Recommended Channels</h3>
            <div className="row">{streamCardStreams}</div>
            <hr className="mt-0 mb-4" />
            <h3 className="text-center text-muted mb-3">Recommended Games</h3>
            <div className="gs-games">{streamCardGames}</div>
        </>
    );
    return (
        <div className="main">
            {
                {
                    loading: <Loader />,
                    success: Dashboard,
                    error: <Alert />,
                }[status]
            }
        </div>
    );
};

export default Dashboard;
