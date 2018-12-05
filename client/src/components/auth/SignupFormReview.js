import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import * as actions from '../../actions';
import formFields from './formFields';

class SignupFormReview extends Component {
  state = { success: false };
  
  onSignup = async (values) => {
    const res = await axios.post("/local/signup", values);
    if (res.data.success) {
      await axios.post("/api/send_email", {
        email: values.email,
        template: values.template
      });
      this.setState({ success: true });
    }
  }

  render() {
    const { onBack, formValues } = this.props;
    const values = formValues;
    values.template = 'signup';
    const reviewFields = formFields.slice(0, 2).map(({ name, placeholder }) => {
      return (
        <div key={name}>
          <h6 className="text-muted">{placeholder}</h6>
          <div>{formValues[name]}</div>
          <br />
        </div>
      );
    });

    return !this.state.success ? (
      <div className="col-md-5 gs-center" style={{ marginTop: '5%' }}>
        <h4>Please confirm your entries</h4>
        <br />
        {reviewFields}
        <br />
        <div className="row px-3">
          <div className="col pl-0 text-left">
            <button className="btn btn-warning" onClick={onBack}>
              Back
            </button>
          </div>
          <div className="col pr-0 text-right">
            <button
              onClick={() => this.onSignup(values)}
              className="btn btn-success"
            >
              Confirm
            </button>
          </div>
        </div>
        <p className="text-right">
          <small style={{ marginTop: '12px' }}>
            {' '}
            By clicking confirm, I agree to your terms
          </small>
        </p>
      </div>
    ) : (
      <div>Email was sent to the address you provided.</div>
    );
  }
}

function mapStateToProps(state) {
  return { formValues: state.form.signupForm.values };
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(SignupFormReview));
