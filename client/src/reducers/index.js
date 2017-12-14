import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dashboardReducer from './dashboardReducer';
import activityReducer from './activityReducer';
import featuredReducer from './featuredReducer';
import topGamesReducer from './topGamesReducer';
import searchReducer from './searchReducer';
import embedReducer from './embedReducer';
import activeTabReducer from './activeTabReducer';
import { reducer as reduxForm } from 'redux-form';

export default combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  activity: activityReducer,
  featured: featuredReducer,
  topGames: topGamesReducer,
  search: searchReducer,
  embed: embedReducer,
  activeTab: activeTabReducer,
  form: reduxForm
});