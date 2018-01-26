import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as apiCalls from '../../actions/apiCalls';
import ReactTooltip from 'react-tooltip';

//Presentational React Component
class GameCard extends Component {
  state = { truncated: false };

  componentDidUpdate() {
    console.log('component GameCard Did Update');
  }

  componentWillUpdate() {
    console.log('this.state.truncated - ?', this.state.truncated);
  }

  searchGame() {
    this.props.searchGamesApi({ search: this.props.name });
  }

  showTooltip() {
    // console.log('TRUNCATED TEXT?');
    // console.log('this.span.offsetWidth - ', this.span.offsetWidth);
    // console.log('this.info.offsetWidth - ', this.info.offsetWidth);
    if (this.span.offsetWidth > this.info.offsetWidth) {
      this.setState({ truncated: true });
    } else {
      this.setState({ truncated: false });
    }
  }

  render() {
    const {
      box,
      name,
      viewers,
      channels,
      spanChannels,
      cardType,
      cardCover,
      maxWidth
    } = this.props;
    let trunc = this.state.truncated;
    console.log(this.props.name);
    console.log(this.state.truncated);
    return (
      <div className={cardType} style={{ maxWidth }}>
        <div className="gs-video-thumbnail">
          <Link to={'/search'} onClick={this.searchGame.bind(this)}>
            <img className={cardCover} src={box} alt={name}/>
          </Link>
        </div>
        <div className="gs-game-info" ref={div => (this.info = div)}>
          <div
            className="game-details iffyTip"
            onMouseOver={this.showTooltip.bind(this)}
          >
            <Link to={'/search'} onClick={this.searchGame.bind(this)}>
              {trunc}
              <span
                className="font-weight-bold"
                data-tip={name}
                ref={span => {
                  this.span = span;
                }}
              >
                {name}
              </span>
              {trunc ? (
                <ReactTooltip
                  place="bottom"
                  type="dark"
                  effect="solid"
                  offset={{ bottom: 20, right: 50 }}
                />
              ) : (
                ''
              )}
            </Link>
            <div>
              <span className=".gs-views">viewers: {viewers}</span>
              <br />
              {spanChannels ? (
                <span className=".gs-views">channels: {channels}</span>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ embed }) {
  return { embed };
}

export default connect(mapStateToProps, apiCalls)(GameCard);
