const initialState = {
  status: "",
  games: [],
  error: ""
}

//define a reducer with an intitalized state and logic to handle action
function topGamesReducer(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_TOPGAMES_REQUEST':
      const requested = Object.assign({}, state, {
        status: action.status
      })
      return requested
    case 'FETCH_TOPGAMES_SUCCESS':
      const successful = Object.assign({}, state, {
        status: action.status,
        games: action.streams
      })
      return successful
    case 'FETCH_TOPGAMES_FAILURE':
      const failed = Object.assign({}, state, {
        status: action.status,
        error: action.error
      })
      return failed
    default:
      return state
  }
}

export default topGamesReducer