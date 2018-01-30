import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import axios from 'axios';

import AuthField from './AuthField';
import validateEmails from '../../utils/validateEmails';
import * as actions from '../../actions';

class Recovery extends Component {
  state = { showSuccess: false, invalid: '' };

  async checkEmail(email, history) {
    await this.props.checkEmail(email);
    if (this.props.auth.emailExists) {
      const sendmail = await axios.post('/api/recovery', email);
      if (sendmail.data.success) {
        console.log(history);
        this.setState({ showSuccess: true });
      } else {
        this.setState({ invalid: 'Error: Email not sent' });
      }
    } else {
      this.setState({ invalid: 'Email not found' });
    }
  }

  renderView() {
    const { handleSubmit, history } = this.props;
    console.log('Recovery P R O P S', this.props);
    console.log('Recovery S T A T E', this.state);
    if (!this.state.showSuccess) {
      return (
        <div>
          <h4>Enter your login email here to recover password:</h4>
          <br />
          <form
            onSubmit={handleSubmit(values => this.checkEmail(values, history))}
          >
            <Field
              type="text"
              name="email"
              component={AuthField}
              icon="envelope"
              formName="recoveryForm"
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
    return <div>Success</div>;
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
  let err = validateEmails(values.email || '');
  console.log('err', err);
  if (err) { errors.email = err; }
  console.log('validateEmails', errors);
  if (!values.email) {
    errors.email = 'You must provide a value';
  }

  return errors;
}

function mapStateToProps({ auth }) {
  return { auth };
}

const RecoveryHOC = connect(mapStateToProps, actions)(Recovery);

export default reduxForm({
  form: 'recoveryForm',
  validate,
  asyncBlurFields: ['email'],
  destroyOnUnmount: false
})(withRouter(RecoveryHOC));
