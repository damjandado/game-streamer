const initialState = {
  featured: {
    status: 0,
    list: [],
  },
  top: {
    status: 0,
    list: [],
  },
  dashboard: {
    broadcasters: [],
    games: [],
    status: "loading",
  },
};

function twitchReducer(state = initialState, action) {
  switch (action.type) {
  case "FETCH_FEATURED":
    return { ...state, featured: {  ...state.featured, ...action.payload } };
  case "FETCH_TOPGAMES":
    return { ...state, top: { ...state.top, ...action.payload } };
  case "FETCH_DASHBOARD":
    return { ...state, dashboard: { ...state.dashboard, ...action.payload } };
  default:
    return state;
  }
}

export default twitchReducer;
