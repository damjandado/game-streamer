import React from 'react';
import Loader from './presentationals/Loader';

export const withLoading = (conditionFn) => (Component) => (props) => (
    <>{conditionFn(props) ? <Loader /> : <Component {...props} />}</>
);
