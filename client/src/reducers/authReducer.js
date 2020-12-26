import { FETCH_USER, LOGIN_USER, SEND_MAIL, CHECK_MAIL } from '../actions/types';

const initialState = {
    isWaiting: false,
    authenticated: null,
    twitchAccessToken: '',
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_USER:
            const { user, twitchAccessToken } = payload;
            return user
                ? { ...state, user, twitchAccessToken, authenticated: true, isWaiting: false }
                : { ...state, user: null, twitchAccessToken, authenticated: false, isWaiting: false };
        case LOGIN_USER:
            return Object.assign({}, state, { isWaiting: true });
        case CHECK_MAIL:
            return Object.assign({}, state, { emailExists: action.payload });
        case SEND_MAIL:
            return Object.assign({}, state, { userId: action.userId || '' });
        default:
            return state;
    }
};
