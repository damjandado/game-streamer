import _ from 'lodash';

const initialState = {
  featured: '',
  top: '',
  search: '',
  channel: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_ACTIVE':
      state = {
        featured: '',
        top: '',
        search: '',
        channel: ''
      };
      console.log('TOGGLE_ACTIVE state before', state);
      state[action.tab] = ' active';
      return state;
    default:
      return state;
  }
}
