import {Meteor} from 'meteor/meteor';
import React,{Component} from 'react';
import Entity from './Entity';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Dashboard from '../containers/DashboardContainer';
import Users from './Users';
import LoginForm from '../containers/LoginFormContainer';
import ResetPasswordLinkForm from '../containers/ResetPasswordLinkFormContainer';
import ResetPasswordForm from '../containers/ResetPasswordFormContainer';
import {Provider} from 'react-redux';
import Store from '../store/Store';
import _ from 'lodash';
const browserHistory = createBrowserHistory();

var App = class extends Entity {

    render() {
        if (Meteor.userId()) {
            if (this.props.user) {
                return (
                    /*jshint ignore:start */
                    <Router history={browserHistory}>
                        <main onClick={this.props.onBodyClick.bind(this)}>
                            <aside className="al-sidebar"
                                   style={{display: this.props.sideMenuVisible && this.props.user.role == 'admin' ? '' : 'none'}}>
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
                            <div className="page-top clearfix">
                                <a style={{display:this.props.user.role == 'admin' ? '' : 'none'}} className="collapse-menu-link ion-navicon"
                                   onClick={this.props.onSideMenuClick.bind(this)}/>
                                <div className={"pull-right dropdown "+(this.props.userMenuVisible ? 'open' : '')} placeholder=""
                                     onClick={this.props.onUserMenuClick.bind(this)}>
                                    <a className="collapse-menu-link fa fa-user  dropdown-toggle" title="Profile"/>
                                    <ul className="top-dropdown-menu profile-dropdown dropdown-menu">
                                        <li>
                                            <a onClick={this.props.onLogoutClick.bind(this)}>
                                                <i className="fa fa-power-off"></i><span>&nbsp;Logout</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={this.props.sideMenuVisible ? 'al-main-with-menu' : 'al-main'}>
                                <div className="al-content">
                                    <div>
                                        <Route exact path="/" render={() => { return <Dashboard/>}}/>
                                        <Route exact path="/users" component={Users}/>
                                    </div>
                                </div>
                            </div>
                            <footer className="al-footer clearfix">
                            </footer>
                        </main>
                    </Router>
                    /*jshint ignore:end */
                );
            } else {
                /*jshint ignore:start */
                return <div>Loading ...</div>;
                /*jshint ignore:end */
            }
        } else {
            return (
                /*jshint ignore:start */
                <Provider store={Store.store}>
                    <Router history={browserHistory}>
                        <div>
                            <Route exact path="/" component={LoginForm}/>
                            <Route exact path="/link" component={ResetPasswordLinkForm}/>
                            <Route exact path="/reset-password/:token" component={ResetPasswordForm}/>
                        </div>
                    </Router>
                </Provider>
                /*jshint ignore:end */
            );
        }
    }
};

export default App;