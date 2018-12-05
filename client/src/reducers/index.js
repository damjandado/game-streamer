import { combineReducers } from "redux";
import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import clipsReducer from "./clipsReducer";
import activityReducer from "./activityReducer";
import twitchReducer from "./twitchReducer";
import searchReducer from "./searchReducer";
import embedReducer from "./embedReducer";
import activeTabReducer from "./activeTabReducer";
import { reducer as reduxForm } from "redux-form";

export default combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  clips: clipsReducer,
  activity: activityReducer,
  twitch: twitchReducer,
  search: searchReducer,
  embed: embedReducer,
  activeTab: activeTabReducer,
  form: reduxForm
});
