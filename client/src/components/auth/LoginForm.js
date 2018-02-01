import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import formFields from './formFields';
import AuthField from './AuthField';

import validateEmails from '../../utils/validateEmails';
import { onLogin } from '../../actions/actions';

import axios from 'axios';

class LoginForm extends Component {
  state = { remember: false };

  onRememberChange() {
    this.setState(prevState => {
      return { remember: !prevState.remember };
    });
    console.log('5th of Novembah');
  }

  renderFields() {
    const signinFields = [];
    signinFields.push(formFields[0], formFields[2]);
    return _.map(signinFields, ({ name, type, placeholder, icon }) => {
      return (
        <Field
          key={name}
          component={AuthField}
          type={type}
          name={name}
          placeholder={placeholder}
          required=""
          icon={icon}
          formName="loginForm"
        />
      );
    });
  }

  render() {
    console.log('LoginForm this.props', this.props);
    const { handleSubmit, onLogin, history } = this.props;
    const { remember } = this.state;
    console.log('S T A T E', this.state);
    return (
      <div>
        <div className="row kpx_row-sm-offset-3">
          <div className="col-xs-12 col-sm-6">
            <form
              className="kpx_loginForm"
              onSubmit={handleSubmit(val =>
                onLogin(val, remember, '/', history)
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
              <Link to="/recovery" className="gs-orange">
                Forgot password?
              </Link>
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

  const keys = _.keys(values);
  _.each(keys, name => {
    if (!values[name]) {
      console.log('values', values);
      console.log('values[name] in validate function', values[name]);
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

const asyncValidate = async values => {
  const res = await axios({
    method: 'POST',
    url: '/api/check_email',
    data: { email: values.email }
  });
  if (!res.data.valid) {
    throw { email: 'That email does not exists' };
  } else {
    let resP = await axios({
      method: 'POST',
      url: '/api/compare_pass',
      data: values
    });
    if (!resP.data.isMatch) {
      throw { password: 'Wrong password' };
    }
  }
};

LoginForm = connect(null, { onLogin })(LoginForm);

export default reduxForm({
  form: 'loginForm',
  initialValues: { email: 'damjandado@ymail.com', password: 'b' },
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(withRouter(LoginForm));
