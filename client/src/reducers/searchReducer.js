const initialState = {
  error: "",
  status: "no_search",
  searchTerm: "",
  foundGames: [],
  foundStreams: [],
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
  case "FETCH_SEARCH":
    console.log(action.payload);
    return { ...initialState, ...action.payload };
  case "NO_SEARCH":
    return Object.assign({}, state, { status: action.status });
  default:
    return state;
  }
}

export default searchReducer;
