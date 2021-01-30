const initialState = {
    error: '',
    status: 'no_search',
    searchTerm: '',
    foundGames: [],
    foundStreams: [],
};

function searchReducer(state = initialState, { type, payload }) {
    switch (type) {
        case 'FETCH_SEARCH':
            return { ...state, foundGames: [], foundStreams: [], ...payload };
        case 'NO_SEARCH':
            return Object.assign({}, state, { status: payload.status });
        default:
            return state;
    }
}

export default searchReducer;
