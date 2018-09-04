const initialState = {
  status: "",
  clips: [],
  error: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    // case 'FETCH_DASHBOARD':
    //   const requested = Object.assign({}, state, {
    //     status: action.status
    //   });
    //   return requested;
    case "FETCH_CLIPS":
      const success = Object.assign({}, state, {
        status: action.status,
        clips: action.clips
      });
      return success;
    // case 'FETCH_DASHBOARD_FAILURE':
    //   const failed = Object.assign({}, state, {
    //     status: action.status,
    //     error: action.error
    //   });
    //   return failed;
    default:
      return state;
  }
}
