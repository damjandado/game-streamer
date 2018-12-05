const initialState = {
  featured: {
    status: 0,
    list: [],
    error: "",
  },
  top: {
    status: 0,
    list: [],
    error: "",
  }
};

function twitchReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_FEATURED":
      return { ...state, featured: { ...action.payload } };
    case "FETCH_TOPGAMES":
      return { ...state, top: { ...action.payload } };
    default:
      return state;
  }
}

export default twitchReducer;
