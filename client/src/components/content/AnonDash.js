import React, { Component } from 'react';

import { withLoading } from '../Hoc';
import TopStreamEmbed from '../presentationals/TopStreamEmbed';

class AnonDash extends Component {
    render() {
        return (
            <div className="mainPage row">
                <div className="col">
                    <TopStreamEmbed channel={{ name: 'monstercat' }} />
                </div>
            </div>
        );
    }
}

let loadingCondition = (props) => false;

export default withLoading(loadingCondition)(AnonDash);
