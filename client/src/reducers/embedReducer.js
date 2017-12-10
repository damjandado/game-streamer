const initialState = {
  name: 'monstercat'
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'EMBED_STREAM':
      return action.embeded || false;
    default:
      return state;
  }
}
