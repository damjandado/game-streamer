import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

class TopGames extends Component {
    componentDidMount() {
        this.props.topGamesApi(60, 0);
    }

    render() {
        const { games } = this.props;
        const { status } = games;
        if (!games.list) return null;
        const gameCardItems = games.list.map((item) => <GameCard key={item.id} game={item} />);
        return (
            <div className="main">
                <h3 className="text-center text-muted">Top Games on Twitch</h3>
                {
                    {
                        loading: <Loader />,
                        success: <div className="row">{gameCardItems}</div>,
                        error: (
                            <div>
                                <Alert error={status} />
                            </div>
                        ),
                    }[status]
                }
            </div>
        );
    }
}

function mapStateToProps({ twitch }) {
    return { games: twitch.top };
}

export default connect(mapStateToProps, actions)(TopGames);
