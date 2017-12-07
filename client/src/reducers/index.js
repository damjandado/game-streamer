import { combineReducers } from 'redux';
import authReducer from './authReducer';
import twitchReducer from './twitchReducer';
import embedReducer from './embedReducer';
import activeTabReducer from './activeTabReducer';

export default combineReducers({
  auth: authReducer,
  twitch: twitchReducer,
  embed: embedReducer,
  activeTab: activeTabReducer
});