import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import AuthField from './AuthField';

import validateEmails from '../../utils/validateEmails';
// import AuthField from './AuthField';
import { onLogin } from '../../actions/actions';

class LoginForm extends Component {
  state = { remember: false };

  onRememberChange(checked) {
    this.setState(prevState => {return { remember: !prevState.remember }});
    console.log('5th of Novembah');
  }

  renderFields() {
    const signinFields = [];
    signinFields.push(formFields[0], formFields[2]);
    return _.map(signinFields, ({ name, type, placeholder, icon, defValue }) => {
      return (
        <Field
          key={name}
          component={AuthField}
          type={type}
          name={`log${name}`}
          placeholder={placeholder}
          required=""
          icon={icon}
        />
      );
    });
  }

  render() {
    console.log('LoginForm this.props', this.props);
    const { handleSubmit, history } = this.props;
    const { remember } = this.state;
    console.log('S T A T E', this.state);
    return (
      <div>
        <div className="row kpx_row-sm-offset-3">
          <div className="col-xs-12 col-sm-6">
            <form
              className="kpx_loginForm"
              onSubmit={handleSubmit(values =>
                this.props.onLogin(values, remember, '/', history)
              )}
              autoComplete="off"
              method="GET"
            >
              {this.renderFields()}
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
                name="remember"
                type="checkbox"
                className="custom-control-input"
                checked={this.state.remember}
                onChange={e => this.onRememberChange(e.target.checked)}
              />
              <span className="custom-control-indicator" />
              <span className="custom-control-description">Remember me!</span>
            </label>
            <p />
          </div>
          <div className="col-xs-12 col-sm-3">
            <p className="kpx_forgotPwd">
              <a href="#" className="gs-orange">
                Forgot password?
              </a>
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
    );
  }
}

function validate(values) {
  const errors = {};

  errors.email = validateEmails(values.email || '');

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

LoginForm = connect(null, { onLogin })(LoginForm);

export default reduxForm({
  form: 'loginForm',
  initialValues: {logemail: 'a@b.c', logpassword: 'abc'},
  validate
})(withRouter(LoginForm));
