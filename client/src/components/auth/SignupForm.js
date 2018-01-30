import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import AuthField from './AuthField';
import validateEmails from "../../utils/validateEmails";

import * as actions from '../../actions';
import formFields from './formFields';

class SignupForm extends Component {
  renderFields() {
    return _.map(formFields, ({ name, type, placeholder, icon }) => {
      return (
        <Field
          key={name}
          component={AuthField}
          type={type}
          name={name}
          placeholder={placeholder}
          required=""
          icon={icon}
          size={40}
          formGroupClass={'row'}
          inputGroupClass={'col-10'}
          formName='signupForm'
        />
      );
    });
  }

  render() {
    return (
        <div className="signin-form profile col-md-6 gs-center">
          <h3>Register</h3>
          <br />
          <div className="login-form">
            <form
              onSubmit={this.props.handleSubmit(this.props.onRegistrationSubmit)}
            >
              {this.renderFields()}
              <input type="submit" value="Next" className="btn btn-primary" />
            </form>
          </div>
          <p>
            <small style={{ marginTop: '10px'}}> By clicking register, I agree to your terms</small>
          </p>
        </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.email || '');

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

const asyncValidate = async values => {
  const { email, username } = values;
  const res = await axios({
    method: 'POST',
    url: '/api/checkmail',
    data: { email }
  });
  if (res.data.valid) {
    throw { email: 'Email already exists!' };
  }
  const resU = await axios({
    method: 'POST',
    url: '/api/checkusername',
    data: { username }
  })
  if (resU.data.valid) {
    throw { username: 'Username already exists!' };
  }
};

SignupForm = connect(null, actions)(SignupForm);

export default reduxForm({
  form: 'signupForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['email', 'username'],
  destroyOnUnmount: false
})(SignupForm);
