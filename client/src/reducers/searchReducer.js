const initialState = {
  status: "",
  users: [],
  games: [],
  error: ""
}

//define a reducer with an intitalized state and logic to handle action
function searchReducer(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_SEARCH_REQUEST':
      const requested = Object.assign({}, state, {
        status: action.status
      })
      return requested
    case 'FETCH_SEARCH_SUCCESS':
      const successful = Object.assign({}, state, {
        status: action.status,
        users: action.users,
        games: action.games
      })
      return successful
    case 'FETCH_SEARCH_FAILURE':
      const failed = Object.assign({}, state, {
        status: action.status,
        error: action.error
      })
      return failed
    default:
      return state
  }
}

export default searchReducer