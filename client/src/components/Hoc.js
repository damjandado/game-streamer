import React, { Fragment } from "react";
import Loader from "./presentationals/Loader";

export const withLoading = conditionFn => Component => props => (
  <Fragment>
    {conditionFn(props) ? <Loader /> : <Component {...props} />}
  </Fragment>
);