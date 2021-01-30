import { combineReducers } from 'redux';
import authReducer from './authReducer';
import clipsReducer from './clipsReducer';
import activityReducer from './activityReducer';
import twitchReducer from './twitchReducer';
import searchReducer from './searchReducer';
import embedReducer from './embedReducer';
import { reducer as reduxForm } from 'redux-form';

export default combineReducers({
    auth: authReducer,
    clips: clipsReducer,
    activity: activityReducer,
    twitch: twitchReducer,
    search: searchReducer,
    embed: embedReducer,
    form: reduxForm,
});
