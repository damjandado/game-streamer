import React from "react";

export default ({ title, postfix, route }) => {
  return (
    <div className="col-xs-2 col-sm-2">
      <a
        href={`/auth/${route}`}
        className={`btn btn-lg btn-block kpx_btn-${postfix}`}
        data-toggle="tooltip"
        data-placement="top"
        title={title}
      >
        <i className={`fa fa-${postfix} fa-2x`} />
        <span className="hidden-xs" />
      </a>
    </div>
  );
};
