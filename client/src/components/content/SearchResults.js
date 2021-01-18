import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import GameCard from '../presentationals/GameCard';
import Alert from '../presentationals/Alert';

class SearchResults extends Component {
    renderHeading = (text) => {
        const { status, error, searchTerm } = this.props;
        const term = <span className="text-info">{searchTerm}</span>;
        return (
            <h3 className="text-center text-muted mb-3">
                {
                    {
                        no_search: 'No search yet.',
                        0: 'Nothing found.',
                        success: (
                            <span>
                                {text} found for term: {term}
                            </span>
                        ),
                        error: <Alert error={error} />,
                    }[status]
                }
            </h3>
        );
    };

    renderStreams = () => {
        const { foundStreams } = this.props;
        if (!foundStreams.length) return null;
        const listStreams = foundStreams.map((item) => <StreamCard key={item.id} stream={item} />);
        return (
            <>
                {this.renderHeading('Streams')}
                <div className="row">{listStreams}</div>
            </>
        );
    };

    renderGames = () => {
        const { foundGames } = this.props;
        if (!foundGames.length) return null;
        const listGames = foundGames.map((item) => <GameCard key={item.id} game={item} />);
        return (
            <>
                {this.renderHeading('Games')}
                <div className="gs-games">{listGames}</div>
            </>
        );
    };

    render() {
        const { status, streams } = this.props;
        if (status === 'loading') return <Loader />;
        return (
            <div className="main">
                <>{this.renderGames()}</>
                <>{this.renderStreams()}</>
            </div>
        );
    }
}

function mapStateToProps({ search }) {
    return { ...search };
}

export default connect(mapStateToProps)(SearchResults);
