import { combineReducers } from 'redux';
import authReducer from './authReducer';
import twitchReducer from './twitchReducer';
import embedReducer from './embedReducer';

export default combineReducers({
  auth: authReducer,
  twitch: twitchReducer,
  embed: embedReducer
});