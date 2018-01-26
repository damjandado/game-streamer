import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import RegistrationField from './RegistrationField';

import validateEmails from '../../utils/validateEmails';
// import RegistrationField from './RegistrationField';
import { onSignIn } from '../../actions/actions';

class LoginForm extends Component {
  renderFields() {
    const signinFields = [];
    signinFields.push(formFields[0], formFields[2]);
    console.log('signinFields', signinFields);
    return _.map(signinFields, ({ name, type, placeholder, icon }) => {
      return (
        <Field
          key={name}
          component={RegistrationField}
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
    return (
      <div className="col-xs-12 col-sm-6">
        <form
          className="kpx_loginForm"
          onSubmit={handleSubmit((values) => this.props.onSignIn(values, '/', history))}
          autoComplete="off"
          method="GET"
        >
          {this.renderFields()}
          <hr />
          <button
            className="btn btn-lg btn-outline-primary btn-block"
            type="submit"
          >
            <i className="fa fa-sign-in" /> Sign In
          </button>
        </form>
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

LoginForm = connect(null, {onSignIn})(LoginForm);

export default reduxForm({
  validate,
  form: 'loginForm'
})(withRouter(LoginForm));
