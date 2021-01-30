import { FETCH_USER, SEND_MAIL, CHECK_MAIL } from '../actions/types';

const initialState = {
    isWaiting: false,
    authenticated: null,
    twAccessToken: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_USER:
            return {
                ...state,
                ...payload,
                authenticated: payload.user ? true : false,
            };
        case CHECK_MAIL:
            return Object.assign({}, state, { emailExists: action.payload });
        case SEND_MAIL:
            return Object.assign({}, state, { userId: action.userId || '' });
        default:
            return state;
    }
};
