const initialState = {
    found: false,
    stream: null,
    user: null,
};

export default function (state = initialState, { type, payload }) {
    switch (type) {
        case 'EMBED_STREAM':
            return { ...state, found: true, ...payload };
        case 'NOT_FOUND':
            return { ...initialState, found: false };
        default:
            return state;
    }
}
