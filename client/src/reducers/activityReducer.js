import { SAVE_ACTIVITY } from '../actions/types';
const initialState = {
  stream: "monstercat",
  game: "Monstercat"
};

export default function (state = [], action) {
  switch (action.type) {
    case SAVE_ACTIVITY:
      const obj = action.payload.stream || action.payload;
      return obj;
    default:
      return state;
  }
}