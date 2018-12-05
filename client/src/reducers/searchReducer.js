const initialState = {
  error: "",
  status: "no_search",
  term: "",
  games: [],
  streams: [],
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
  case "FETCH_SEARCH_REQUEST":
    return { ...state, ...action.payload };
  case "FETCH_SEARCH_SUCCESS":
    return { ...state, ...action.payload };
  case "FETCH_SEARCH_FAILURE":
  return { ...state, ...action.payload };
  case "NO_SEARCH":
    return Object.assign({}, state, { status: action.status });
  case "SEARCH_GAMES":
    return { ...state, ...action.payload };
  default:
    return state;
  }
}

export default searchReducer;
