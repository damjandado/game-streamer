import React from 'react';

export default values => {
  const { input, meta, type, placeholder, required, icon } = values;
  console.log('values', values);
  console.log(meta);
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
        <small class="form-text text-muted">{meta.touched && meta.error}</small>
        <br />
      </div>
    </div>
  );
};
