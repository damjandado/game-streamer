const initialState = {
  featured: "",
  top: "",
  search: "",
  channel: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_ACTIVE":
      state = {
        featured: "",
        top: "",
        search: "",
        channel: ""
      };
      state[action.tab] = " active text-success";
      return state;
    default:
      return state;
  }
}
