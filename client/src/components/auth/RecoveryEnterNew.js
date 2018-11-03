import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import axios from "axios";

import AuthField from "./AuthField";
import NotFound from "../presentationals/NotFound";

class RecoveryEnterNew extends Component {
  state = { validLink: false, success: false, errorPage: false, email: "" };

  async componentDidMount() {
    const {
      match: { params }
    } = this.props;
    const res = await axios({
      method: "POST",
      url: "/api/users/userid",
      data: params.userId
    });
    if (res.data.success) {
      this.setState({ validLink: true, email: res.data.email });
    } else {
      this.setState({ errorPage: true });
    }
  }

  async checkPasswords(values) {
    values = { email: this.state.email, ...values };
    const res = await axios({
      method: "POST",
      url: "/api/change_pass",
      data: values
    });
    if (res.data.valid) {
      this.setState({ success: true });
    }
  }

  renderView() {
    const { handleSubmit } = this.props;
    const { validLink, success } = this.state;
    if (validLink) {
      if (!success) {
        return (
          <div className="col-sm-6 gs-center">
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
              <input
                type="submit"
                value="Confirm"
                className="btn btn-success"
              />
            </form>
          </div>
        );
      }
      return (
        <div className="col-sm-6 gs-center mt-3">
          Password successfully changed.
        </div>
      );
    } else return <div />;
  }

  render() {
    return !this.state.errorPage ? (
      <div>{this.renderView()}</div>
    ) : (
      <NotFound />
    );
  }
}

function validate(val) {
  const errors = {};
  if (val.password !== val.passwordConfirm) {
    errors.password = "Passwords do not match";
  }

  return errors;
}

export default reduxForm({
  form: "recoveryForm",
  validate,
  destroyOnUnmount: false
})(RecoveryEnterNew);
