//define action within an action creator
function fetchFailure(error) {
  const FETCH_FAILURE = 'FETCH_FAILURE'
  return {
    type: FETCH_FAILURE,
    status: "error",
    error
  }
}

export default fetchFailure
