import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SocialButton from './SocialButton';

export default () => {
  return (
    <div className="container">
      <div className="kpx_login">
        <h3 className="kpx_authTitle">
          Login or{' '}
          <Link to="/signup" className="red btn-flat white-text gs-orange">
            Signup
          </Link>
        </h3>

        <div className="row kpx_row-sm-offset-3 kpx_socialButtons">
          <SocialButton title="Twitch" postfix="twitch" route="twitch" />
          <SocialButton title="Google+" postfix="google-plus" route="google" />
          <SocialButton title="Facebook" postfix="facebook" route="facebook" />
        </div>

        <div className="row kpx_row-sm-offset-3 kpx_loginOr">
          <div className="col-xs-12 col-sm-6">
            <hr className="kpx_hrOr" />
            <span className="kpx_spanOr">or</span>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
