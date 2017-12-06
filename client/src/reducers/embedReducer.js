export default function(state = 'monstercat', action) {
  switch (action.type) {
    case 'EMBED_STREAM':
      return action.embeded || false;
    default:
      return state;
  }
}
