import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import AuthField from './AuthField';

class RecoveryEnterNew extends Component {
  state = { showSuccess: false };

  async checkPasswords(values) {
    const res = await axios({
      method: 'POST',
      url: '/api/checkpass',
      data: values
    });
    if (res.data.valid) {
      this.setState({ showSuccess: true });
    }
  }

  renderView() {
    const { handleSubmit } = this.props;
    if (!this.state.showSuccess) {
      return (
        <div>
          <h4>Enter new password:</h4>
          <br />
          <form onSubmit={handleSubmit(this.checkPasswords.bind(this))}>
            <Field
              type="password"
              name="password"
              component={AuthField}
              icon="key"
            />
            <Field
              type="password"
              name="passwordConfirm"
              component={AuthField}
              icon="key"
            />
            <input type="submit" value="Confirm" />
          </form>
        </div>
      );
    }
    return <div>Success</div>;
  }

  render() {
    return <div>{this.renderView()}</div>;
  }
}

function validate(val) {
  const errors = {};
  if (val.password !== val.passwordConfirm) {
    errors.password = 'Passwords do not match';
  }

  return errors;
}

export default reduxForm({
  form: 'recoveryForm',
  validate
})(RecoveryEnterNew);
