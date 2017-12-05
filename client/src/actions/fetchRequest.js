//define action within an action creator
function fetchRequest() {
  const FETCH_REQUEST = 'FETCH_REQUEST'
  return {
    type: FETCH_REQUEST,
    status: "loading"
  }
}

export default fetchRequest
