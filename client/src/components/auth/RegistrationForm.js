import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RegistrationField from './RegistrationField';
import validateEmails from "../../utils/validateEmails";
import { reduxForm, Field } from 'redux-form';
import formFields from './formFields';

class RegistrationForm extends Component {
  renderFields() {
    return _.map(formFields, ({ name, type, placeholder, icon }) => {
      return (
        <Field
          key={name}
          component={RegistrationField}
          type={type}
          name={name}
          placeholder={placeholder}
          required=""
          icon={icon}
          size={40}
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
              <input type="submit" value="REGISTER" />
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

export default reduxForm({
  validate,
  form: 'registrationForm',
  destroyOnUnmount: false
})(RegistrationForm);
