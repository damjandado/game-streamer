import React, { Component } from 'react';

import { withLoading } from '../Hoc';
import TwitchEmbed from '../presentationals/TwitchEmbed';

class AnonDash extends Component {
    render() {
        return (
            <div className="mainPage row">
                <div className="col">
                    <TwitchEmbed channel={{ name: 'monstercat' }} />
                </div>
            </div>
        );
    }
}

let loadingCondition = (props) => false;

export default withLoading(loadingCondition)(AnonDash);
