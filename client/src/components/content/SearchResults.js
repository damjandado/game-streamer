import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

class SearchResults extends Component {
    renderHeading = () => {
        const { status, error, searchTerm } = this.props;
        const term = <i className="text-info">{searchTerm}</i>;
        return (
            <h3 className="text-center text-muted">
                {
                    {
                        no_search: 'No search yet.',
                        0: 'Nothing found.',
                        success: <span>Games found for term: {term}</span>,
                        error: <Alert error={error} />,
                    }[status]
                }
            </h3>
        );
    };

    renderStreams = () => {
        const { streams } = this.props;
        const listStreams = streams.map((item) => <StreamCard key={item.id} stream={item} />);
        return <div className="row">{listStreams}</div>;
    };

    renderGames = () => {
        const { games } = this.props;
        console.log(games);
        const listGames = games.map((item) => <GameCard key={item.id} game={item} />);
        return <div className="row">{listGames}</div>;
    };

    render() {
        const { status } = this.props;
        if (status === 'loading') return <Loader />;
        return (
            <div className="main">
                {this.renderHeading()}
                <div>{this.renderGames()}</div>
                <div>{this.renderStreams()}</div>
            </div>
        );
    }
}

function mapStateToProps({ search }) {
    return { ...search };
}

export default connect(mapStateToProps)(SearchResults);
