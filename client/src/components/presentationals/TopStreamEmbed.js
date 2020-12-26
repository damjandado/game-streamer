import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const TopStreamEmbed = ({ channel, ...props }) => {
	if (!channel.name) return <div>Loading...</div>;
	const { name, title, user_name, user_id } = channel;
	let logo, display_name, game, text;
	const { history, searchStreams } = props;

	const renderText = () => {
		return { __html: text };
	};

	return (
		<div className="twitchWrapper">
			<div className="topStream">
				<iframe
					src={`https://player.twitch.tv/?channel=${name}&parent=${encodeURIComponent(process.env.REACT_APP_DOMAIN)}`}
					width="100%"
					height="auto"
					frameBorder="0"
					scrolling="no"
					title={title}
				/>
				<br />
				{user_id && <div id="gs-channel-info" className="row">
					<div className="col-sm-10">
						<div className="gs-stream-info">
							<div className="profile-image">
								<figure className="gs-avatar-40 gs-figure">
									<img src={logo} alt="logo" />
								</figure>
							</div>
							<div className="stream-details text-12">
								<span className="font-weight-bold text-14">
									{title}
								</span>
								<br />
								<Link
									to={`/${name}`}
									onClick={activeChannel.bind(this)}
								>
									{display_name}
								</Link>{' '}
								plays{' '}
								<Link
									to={'/search'}
									onClick={() =>
										searchStreams(
											{ search: game },
											history
										)
									}
								>
									{game}
								</Link>
							</div>
						</div>
					</div>
					<div className="col-sm-2 text-right">
						<br />
					</div>
					<div
						className="col-sm-12 text-12 d-none d-sm-block"
						dangerouslySetInnerHTML={renderText()}
					/>
				</div>}
			</div>
		</div>
	);
};

export default connect(null, actions)(withRouter(TopStreamEmbed));
