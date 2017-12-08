import _ from "lodash";

const initialState = {
  featured: true,
  top: false,
  search: false,
  channel: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_ACTIVE":
      const current = state;
      const tab = current[action.tab];
      if (!tab) {
        _.each(current, (val, key) => (current[key] = false));
        console.log('Current TAB state', current);
        // current[action.tab] = true;
        return Object.assign({}, current);
      }
      return state;
    default:
      return state;
  }
}
