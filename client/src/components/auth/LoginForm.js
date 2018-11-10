import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { withRouter, Link } from 'react-router-dom';
import formFields from './formFields';
import AuthField from './AuthField';

import validateEmails from '../../utils/validateEmails';

import axios from 'axios';

class LoginForm extends Component {
  state = { remember: false };

  onRememberChange() {
    this.setState(prevState => {
      return { remember: !prevState.remember };
    });
  }

  renderFields() {
    const loginFields = [];
    loginFields.push(formFields[0], formFields[2]);
    return loginFields.map(({ name, type, placeholder, icon }) => {
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

  onLogin = async (values) => {
    const { remember } = this.state;
    values.remember = remember;
    const res = await axios.post("/local/login", values);
    if (res.data.success) {
      localStorage.setItem("jwtToken", res.data.token);
      window.location.reload();
    }
  }

  render() {
    const { handleSubmit, onLogin, history } = this.props;
    const { remember } = this.state;
    return (
      <div>
        <div className="row kpx_row-sm-offset-3">
          <div className="col-xs-12 col-sm-6">
            <form
              className="kpx_loginForm"
              onSubmit={handleSubmit(this.onLogin)}
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
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  const loginFields = [];
  loginFields.push(formFields[0], formFields[2]);

  errors.email = validateEmails(values.email || '');

  loginFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

const asyncValidate = async values => {
  if (values.email !== '') {
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
  }
};

export default reduxForm({
  form: 'loginForm',
  // initialValues: { email: 'damjandado@ymail.com', password: 'b' },
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(withRouter(LoginForm));
