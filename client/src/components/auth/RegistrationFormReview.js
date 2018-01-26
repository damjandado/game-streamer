import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import * as actions from "../../actions/actions";
import formFields from "./formFields";

const RegistrationFormReview = ({ onCancel, formValues, onRegister, history }) => {
  const reviewFields = _.map(formFields, ({ name, placeholder }) => {
    return (
      <div>
        <div key={name}>
          <label>{placeholder}</label>
        </div>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => onRegister(formValues, history)}
        className="green white-text btn-flat right"
      >
        Confirm
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.registrationForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(RegistrationFormReview));