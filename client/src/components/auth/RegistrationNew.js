import React, { Component } from "react";
import { reduxForm } from 'redux-form';
import RegistrationForm from "./RegistrationForm";
import RegistrationFormReview from "./RegistrationFormReview";

class RegistrationNew extends Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <RegistrationFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <RegistrationForm
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
})(RegistrationNew);
