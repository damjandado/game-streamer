import React from 'react';

export default () => {
  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#myModal"
      >
        Log In
      </button>

      <div className="modal fade" id="myModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="container">
                <div className="kpx_login">
                  <h3 className="kpx_authTitle">
                    Login or <a href="/">Sign up</a>
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
                    <div className="col-xs-12 col-sm-6">
                      <form
                        className="kpx_loginForm"
                        action=""
                        autoComplete="off"
                        method="POST"
                      >
                        <div className="input-group">
                          <span className="input-group-addon">
                            <span className="fa fa-user" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                          />
                        </div>
                        <hr />
                        <div className="input-group">
                          <span className="input-group-addon">
                            <span className="fa fa-key" />
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                          />
                        </div>
                        <span className="tag tag-danger">
                          Password Error!
                        </span>{' '}
                        |{' '}
                        <span className="tag tag-success">
                          Login success!
                        </span>{' '}
                        |{' '}
                        <span className="tag tag-warning">
                          Some of password must not be empty!
                        </span>
                        <hr />
                        <button
                          className="btn btn-lg btn-outline-primary btn-block"
                          type="submit"
                        >
                          <i className="fa fa-sign-in" /> Login
                        </button>
                      </form>
                    </div>
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
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
