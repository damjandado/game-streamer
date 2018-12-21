import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

class SearchForm extends Component {
  onSearch = ({ search }) => {
    const { topGamesApi, history } = this.props;
    topGamesApi(100, 0, search);
    history.push('/search');
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form
        className="form-inline my-2 my-lg-0"
        onSubmit={handleSubmit(this.onSearch)}
      >
        <Field
          className="form-control-sm mr-sm-2"
          type="text"
          name="search"
          placeholder="Search"
          component="input"
          size={40}
        />
        <button
          className="btn btn-sm text-white gs-button my-2 my-sm-0"
          type="submit"
        >
          {`Search`}
        </button>
      </form>
    );
  }
}

SearchForm = connect(
  null,
  actions
)(SearchForm);

export default reduxForm({
  form: 'searchForm'
})(withRouter(SearchForm));
