import React from 'react';

export default values => {
  const { input, meta, type, placeholder, required, icon } = values;
  // console.log('values', values);
  return (
    <div className="form-group">
      <div className="input-group">
        <span className="input-group-addon">
          <span className={`fa fa-${icon}`} />
        </span>
        <input
          {...input}
          type={type}
          placeholder={placeholder}
          required={required}
          className="form-control"
        />
      </div>
      <small className="form-text text-muted">
        {meta.touched && meta.error}
      </small>
      <hr />
    </div>
  );
};
