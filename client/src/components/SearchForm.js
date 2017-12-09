import React, { Component } from "react";
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import * as actions from "../actions";

class SearchForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form
        className="form-inline my-2 my-lg-0"
        onSubmit={handleSubmit(value => this.props.searchGamesApi(value))}
      >
        <Field
          className="form-control mr-sm-2"
          type="text"
          name="search"
          placeholder="Search"
          component="input"
        />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    );
  }
}

SearchForm = connect(null, actions)(SearchForm);

export default reduxForm({
  form: "searchForm"
})(SearchForm);
