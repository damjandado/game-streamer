import React, { Component } from "react";
import { reduxForm } from 'redux-form';
import SignupForm from "./SignupForm";
import SignupFormReview from "./SignupFormReview";

class SignupNew extends Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SignupFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <SignupForm
        onRegistrationSubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: 'registrationForm'
})(SignupNew);
