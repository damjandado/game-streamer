const initialState = {
    status: '',
    clips: [],
    error: '',
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'FETCH_CLIPS':
            const success = Object.assign({}, state, {
                status: action.status,
                clips: action.clips,
            });
            return success;
        default:
            return state;
    }
}
