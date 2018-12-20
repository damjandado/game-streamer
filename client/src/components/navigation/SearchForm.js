import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

class SearchForm extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () =>
    setTimeout(() => {
      this.setState({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 100);

  onSearch = ({ search }) => {
    const { topGamesApi, history } = this.props;
    topGamesApi(100, 0, search);
    history.push('/search');
  }

  render() {
    const { handleSubmit } = this.props;
    const { width } = this.state;
    const full = width > 991 || width < 576;
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
          size={full ? 40 : width > 767 ? 30 : 20}
        />

        {full ? (
          <button
            className="btn btn-sm text-white gs-button my-2 my-sm-0"
            type="submit"
          >
            {`Search`}
          </button>
        ) : (
          <div />
        )}
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
