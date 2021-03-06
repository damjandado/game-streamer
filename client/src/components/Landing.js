import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './content/Dashboard';
import Featured from './content/Featured';
import TopGames from './content/TopGames';
import Channel from './content/Channel';
import SearchResults from './content/SearchResults';
import SignupNew from './auth/SignupNew';
import LoginNew from './auth/LoginNew';
import Recovery from './auth/Recovery';
import RecoveryEnterNew from './auth/RecoveryEnterNew';
import ConfirmRegistration from './auth/ConfirmRegistration';

export default () => {
    return (
        <div className="gs-main container-fluid px-4 py-3">
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/login" component={LoginNew} />
                <Route path="/signup" component={SignupNew} />
                <Route path="/recovery" component={Recovery} />
                <Route path="/users/password-recovery/:userId" component={RecoveryEnterNew} />
                <Route path="/users/confirmation/:userId" component={ConfirmRegistration} />
                <Route path="/featured" component={Featured} />
                <Route path="/topgames" component={TopGames} />
                <Route path="/search" component={SearchResults} />
                <Route path={'/:channelName'} component={Channel} />
            </Switch>
        </div>
    );
};
