import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Loader from '../presentationals/Loader';
import StreamCard from '../presentationals/StreamCard';
import Alert from '../presentationals/Alert';

class Featured extends Component {
    state = { fetched: false };

    componentDidUpdate() {
        if (this.props.auth.authenticated && !this.state.fetched) {
            this.props.featuredApi(100);
            this.setState({ fetched: true });
        }
    }

    render() {
        const { featured } = this.props;
        const { status } = featured;
        const streamCardItems = featured.list.map((item) => (
            <StreamCard key={item.id} stream={item} />
        ));
        return (
            <div className="main">
                <h3 className="text-center text-muted">Featured Streams</h3>
                {
                    {
                        loading: <Loader />,
                        success: <div className="row">{streamCardItems}</div>,
                        error: <Alert error={status} />,
                    }[status]
                }
            </div>
        );
    }
}

function mapStateToProps({ auth, twitch }) {
    return { auth, featured: twitch.featured };
}

export default connect(mapStateToProps, actions)(Featured);
