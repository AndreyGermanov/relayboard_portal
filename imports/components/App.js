import {Meteor} from 'meteor/meteor';
import React,{Component} from 'react';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
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
                        <main>
                            <aside className="al-sidebar">
                                <ul className="al-sidebar-list">
                                    <li className="al-sidebar-list-item">
                                        <Link className="al-sidebar-list-link" to={{pathname:'/'}}>
                                            <i className="fa fa-home"></i>
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link className="al-sidebar-list-link" to={{pathname:'/users'}}>
                                            <i className="fa fa-users"></i>
                                            <span>Users</span>
                                        </Link>
                                    </li>
                                </ul>
                            </aside>
                            <div className="al-main">
                                <div className="al-content">
                                    <div>
                                        <Route exact path="/" component={Dashboard}/>
                                        <Route exact path="/users" component={Users}/>
                                    </div>
                                </div>
                            </div>
                            <footer className="al-footer clearfix">
                            </footer>
                        </main>
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