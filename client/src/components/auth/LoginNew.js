import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';

class LoginNew extends Component {
  render() {
    console.log('LoginNew this.props are', this.props);
    return (
            <div className="container">
              <div className="kpx_login">
                <h3 className="kpx_authTitle">
                  Login or{' '}
                  <Link
                    to="/signup"
                    className="red btn-flat white-text"
                  >
                    Sign up
                  </Link>
                </h3>
                <div className="row kpx_row-sm-offset-3 kpx_socialButtons">
                  <div className="col-xs-2 col-sm-2">
                    <a
                      href="/auth/twitch"
                      className="btn btn-lg btn-block kpx_btn-twitch"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Twitch"
                    >
                      <i className="fa fa-twitch fa-2x" />
                      <span className="hidden-xs" />
                    </a>
                  </div>
                  <div className="col-xs-2 col-sm-2">
                    <a
                      href="/auth/google"
                      className="btn btn-lg btn-block kpx_btn-google-plus"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Google Plus"
                    >
                      <i className="fa fa-google-plus fa-2x" />
                      <span className="hidden-xs" />
                    </a>
                  </div>
                </div>

                <div className="row kpx_row-sm-offset-3 kpx_loginOr">
                  <div className="col-xs-12 col-sm-6">
                    <hr className="kpx_hrOr" />
                    <span className="kpx_spanOr">or</span>
                  </div>
                </div>

                <div className="row kpx_row-sm-offset-3">
                  <LoginForm />
                </div>
                <div className="row kpx_row-sm-offset-3">
                  <div className="col-xs-12 col-sm-3">
                    <p />
                    <label className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        value="remember-me"
                      />
                      <span className="custom-control-indicator" />
                      <span className="custom-control-description">
                        Remember me!
                      </span>
                    </label>
                    <p />
                  </div>
                  <div className="col-xs-12 col-sm-3">
                    <p className="kpx_forgotPwd">
                      <a href="#">Forgot password?</a>
                    </p>
                  </div>

                  <div className="col-lg-12">
                    <p className="text-lg-center text-md-center text-sm-center text-xs-center">
                      Created by{' '}
                      <a href="http://www.koalapix.com" target="_blank">
                        koalapix. studio
                      </a>, for crazy developers...
                    </p>
                  </div>
                </div>
              </div>
            </div>
    );
  }
}

// export default connect(null, { onLoginSubmit })(LoginNew);
export default LoginNew;
