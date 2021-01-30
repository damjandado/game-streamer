import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

class SearchForm extends Component {
    onSearch = ({ search }) => {
        console.log('search for', search);
        const { topGamesApi, history } = this.props;
        topGamesApi(100, 0, search);
        history.push('/search');
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <form className="my-2 my-lg-0 flex-auto d-flex" onSubmit={handleSubmit(this.onSearch)}>
                <Field
                    className="form-control-md flex-auto max-w-md p-1 px-2 mr-sm-2 rounded bg-gray-100"
                    type="text"
                    name="search"
                    placeholder="Search"
                    component="input"
                />
                <button className="text-white gs-button d-none d-md-block" type="submit">
                    {`Search`}
                </button>
            </form>
        );
    }
}

SearchForm = connect(null, actions)(SearchForm);

export default reduxForm({
    form: 'searchForm',
})(withRouter(SearchForm));
