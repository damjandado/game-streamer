const initialState = {
  error: "",
  status: "no_search",
  searchTerm: "",
  games: [],
  streams: [],
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
  case "FETCH_SEARCH":
    return { ...state, ...action.payload };
  case "NO_SEARCH":
    return Object.assign({}, state, { status: action.status });
  default:
    return state;
  }
}

export default searchReducer;
