const initialState = {
  status: "",
  featured: [],
  error: ""
}

//define a reducer with an intitalized state and logic to handle action
function twitchReducer(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_FEATURED_REQUEST':
      const requested = Object.assign({}, state, {
        status: action.status
      })
      return requested
    case 'FETCH_FEATURED_SUCCESS':
      const successful = Object.assign({}, state, {
        status: action.status,
        featured: action.featured
      })
      return successful
    case 'FETCH_FEATURED_FAILURE':
      const failed = Object.assign({}, state, {
        status: action.status,
        error: action.error
      })
      return failed
    default:
      return state
  }
}

export default twitchReducer
