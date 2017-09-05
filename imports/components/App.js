import {Meteor} from 'meteor/meteor';
import React,{Component} from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import Dashboard from './Dashboard';
import Users from './Users';
import LoginForm from '../containers/LoginFormContainer';
import {Provider} from 'react-redux-meteor';
import Store from '../store/Store';

var App = class extends Component {
    render() {
        if (Meteor.userId()) {
            const browserHistory = createBrowserHistory();
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
                    <LoginForm/>
                </Provider>
            )
        }
    }
}

export default App;