import React from 'react';
import { connect } from 'react-redux';

const AuthField = (values) => {
    const { input, meta, type, placeholder, required, icon } = values;
    const { formProp, formName } = values;
    const cs = formProp[formName]
        ? formProp[formName].asyncErrors
            ? formProp[formName].asyncErrors[input.name]
                ? 'is-invalid'
                : ''
            : ''
        : '';
    return (
        <div>
            <div className={`input-group`}>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <span className={`fa fa-${icon}`} />
                    </span>
                </div>
                <input
                    {...input}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={`form-control ${cs}`}
                    id={input.name}
                />
            </div>
            <small className="form-text text-danger">{meta.touched && meta.error}</small>
            <hr />
        </div>
    );
};

function mapStateToProps({ form }) {
    return { formProp: form };
}

export default connect(mapStateToProps)(AuthField);
