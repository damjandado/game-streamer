import React, { Component } from 'react';

class VideoCard extends Component {
    iframe() {
        let iframeCustom = this.props.iframe.replace(
            'tt_content=embed',
            'tt_content=embed&autoplay=false'
        );
        iframeCustom = iframeCustom.replace(
            "width='640' height='360'",
            "width='100%' height='100%'"
        );
        return { __html: iframeCustom };
    }

    render() {
        return (
            <div className="col-12 p-2">
                <div className="gs-clip" dangerouslySetInnerHTML={this.iframe()} />
            </div>
        );
    }
}

export default VideoCard;
