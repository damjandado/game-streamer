import { combineReducers } from 'redux';
import authReducer from './authReducer';
import featuredReducer from './featuredReducer';
import topGamesReducer from './topGamesReducer';
import searchReducer from './searchReducer';
import embedReducer from './embedReducer';
import activeTabReducer from './activeTabReducer';
import { reducer as reduxForm } from 'redux-form';

export default combineReducers({
  auth: authReducer,
  featured: featuredReducer,
  topGames: topGamesReducer,
  search: searchReducer,
  embed: embedReducer,
  activeTab: activeTabReducer,
  form: reduxForm
});