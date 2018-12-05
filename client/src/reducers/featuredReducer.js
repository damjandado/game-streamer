const initialState = {
  status: "not_found",
  list: [],
  error: ""
};

//define a reducer with an intitalized state and logic to handle action
function twitchReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_FEATURED_REQUEST":
      const requested = Object.assign({}, state, {
        status: action.status
      });
      return requested;
    case "FETCH_FEATURED_SUCCESS":
      return { ...state, ...action.payload };
    case "FETCH_FEATURED_FAILURE":
      const failed = Object.assign({}, state, {
        status: action.status,
        error: action.error
      });
      return failed;
    default:
      return state;
  }
}

export default twitchReducer;
