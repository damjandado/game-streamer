import { combineReducers } from 'redux';
import authReducer from './authReducer';
import twitchReducer from './twitchReducer';

export default combineReducers({
  auth: authReducer,
  twitch: twitchReducer,
});