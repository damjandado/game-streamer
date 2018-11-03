import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import AuthField from './AuthField';
import validateEmails from '../../utils/validateEmails';

import * as actions from '../../actions';
import formFields from './formFields';

class SignupForm extends Component {
  renderFields() {
    return formFields.map(({ name, type, placeholder, icon }) => {
      return [
        <div className="form-group row">
          <label
            for={name}
            className="col-sm-3 col-form-label pl-4 pr-0 text-left"
          >
            {placeholder}
          </label>
          <div className="col-sm-7 pl-0">
            <Field
              key={name}
              component={AuthField}
              type={type}
              name={name}
              id={name}
              placeholder={placeholder}
              required=""
              icon={icon}
              size={40}
              formName="signupForm"
              className=""
            />
          </div>
        </div>
      ];
    });
  }

  render() {
    return (
      <div
        className="signin-form profile col-lg-7 gs-center"
        style={{ marginTop: '5%' }}
      >
        <h3 className="col-md-4">Sign up</h3>
        <br />
        <div className="login-form">
          <form onSubmit={this.props.handleSubmit(this.props.onNext)}>
            {this.renderFields()}
            <div className="col-sm-10 pr-0 text-right">
              <input type="submit" value=" Next " className="btn btn-primary" />
            </div>
          </form>
        </div>
        <p className="text-right pr-0 col-sm-10">
          <small style={{ marginTop: '12px' }}>
            {' '}
            Click next for the final step
          </small>
        </p>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.email = validateEmails(values.email || '');

  formFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

const asyncValidate = async values => {
  const { email, username, password, psw } = values;
  const res = await axios({
    method: 'POST',
    url: '/api/check_email',
    data: { email }
  });
  if (res.data.valid) {
    throw { email: 'Email already exists!' };
  }
  const resU = await axios({
    method: 'POST',
    url: '/api/check_username',
    data: { username }
  });
  if (resU.data.valid) {
    throw { username: 'Username already exists!' };
  }
  if (password !== psw) {
    throw { psw: 'Passwords do not match!' };
  }
};

SignupForm = connect(
  null,
  actions
)(SignupForm);

export default reduxForm({
  form: 'signupForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['email', 'username', 'password', 'psw'],
  destroyOnUnmount: false
})(SignupForm);
