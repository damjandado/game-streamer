const initialState = {
  featured: true,
  channel: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_ACTIVE':
      if (!action.isActive)
        return Object.assign(
          {},
          {
            featured: !state.featured,
            channel: !state.channel
          }
        );
      return state;
    default:
      return state;
  }
}
