import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { post } from '../../utils/http';
import NotFound from '../presentationals/NotFound';

const ConfirmRegistration = ({ match, history }) => {
    const [state, setState] = useState({ success: false, errorPage: false, email: '' });

    useEffect(() => {
        const { params } = match;
        post('/api/users/userid', { userId: params.userId, user: false })
            .then((data) => {
                if (data.success) {
                    setState({ ...state, success: true });
                    setTimeout(() => {
                        history.push('/');
                    }, 3000);
                } else {
                    setState({ ...state, errorPage: true });
                }
            })
            .catch((err) => {
                console.log('confirm registration', err);
            });
    }, []);

    if (state.success) {
        return (
            <div>
                <h4>You have successfully signed up!</h4>
                <p>You'll be redireted shortly...</p>
            </div>
        );
    } else if (state.errorPage) {
        return <NotFound />;
    }
    return <div />;
};

export default withRouter(ConfirmRegistration);
