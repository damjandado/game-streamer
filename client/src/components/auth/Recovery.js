import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import RecoveryEnterNew from './RecoveryEnterNew';
import AuthField from './AuthField';
import validateEmails from '../../utils/validateEmails';

class Recovery extends Component {
  state = { showEnterNew: false, invalid: '' };

  async checkEmail(email) {
    const res = await axios({
      method: 'POST',
      url: '/api/checkmail',
      data: email
    });
    if (res.data.valid) {
      const res = await axios.post('/api/recovery', email);
      this.setState({ showEnterNew: true });
    } else {
      this.setState({ invalid: 'Email was not found' });
    }
  }

  renderView() {
    const { handleSubmit, history } = this.props;
    console.log('Recovery P R O P S', this.props);
    console.log('Recovery S T A T E', this.state);
    if (!this.state.showEnterNew) {
      return (
        <div>
          <h4>Enter your login email here to recover password:</h4>
          <br />
          <form onSubmit={handleSubmit(this.checkEmail.bind(this))}>
            <Field
              type="text"
              name="email"
              component={AuthField}
              icon="envelope"
            />
            <button
              type="submit"
              style={{ marginLeft: 10 }}
              className="btn btn-primary"
            >
              Recover
            </button>
          </form>
          <div>{this.state.invalid}</div>
        </div>
      );
    }
    return <RecoveryEnterNew />;
  }

  render() {
    return (
      <div className="container">
        <div className="row kpx_row-sm-offset-3">
          <div className="col-xs-12 col-sm-6">{this.renderView()}</div>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  errors.email = validateEmails(values.email || '');
  console.log('validateEmails', errors);
  if (!values.email) {
    errors.email = 'You must provide a value';
  }

  return errors;
}

export default reduxForm({
  form: 'recoveryForm',
  validate,
  asyncBlurFields: ['email']
})(Recovery);
