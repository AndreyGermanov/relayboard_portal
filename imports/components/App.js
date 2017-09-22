import {Meteor} from 'meteor/meteor';
import React,{Component} from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import Dashboard from '../containers/DashboardContainer';
import Users from './Users';
import LoginForm from '../containers/LoginFormContainer';
import ResetPasswordLinkForm from '../containers/ResetPasswordLinkFormContainer';
import ResetPasswordForm from '../containers/ResetPasswordFormContainer';
import {Provider} from 'react-redux-meteor';
import Store from '../store/Store';

var App = class extends Component {
    render() {
        const browserHistory = createBrowserHistory();
        if (Meteor.userId()) {
            return (
                <Provider store={Store.store}>
                    <Router history={browserHistory}>
                        <div>
                            <Route exact path="/" component={Dashboard}/>
                            <Route exact path="/users" component={Users}/>
                        </div>
                    </Router>
                </Provider>
            )
        } else {
            return (
                <Provider store={Store.store}>
                    <Router history={browserHistory}>
                        <div>
                            <Route exact path="/" component={LoginForm}/>
                            <Route exact path="/link" component={ResetPasswordLinkForm}/>
                            <Route exact path="/reset-password/:token" component={ResetPasswordForm}/>
                        </div>
                    </Router>
                </Provider>
            )
        }
    }
}

export default App;