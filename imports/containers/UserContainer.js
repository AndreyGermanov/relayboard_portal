import React from 'react';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import User from '../components/User';
import { withTracker } from 'meteor/react-meteor-data';
import Store from '../store/Store';
import actions from '../actions/UsersActions';
import {Redirect} from 'react-router';
import _ from 'lodash';

const mapStateToProps = (state,ownProps) => {
    return {
        errors: state.Users.user.errors,
        user: state.Users.user.item,
        user_id: ownProps.user_id,
        relayboards: ownProps.relayboards
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        onChangeField: (field,e) => {
           dispatch(actions.changeFieldValue(field,e.target.value));
        },
        onSaveClick: (e) => {
            e.preventDefault();
            var errors = {},
                state = Store.store.getState().Users.user.item;
            if (!state.email.trim()) {
                errors.email = 'Email is required';
            }
            if (!state.username.trim()) {
                errors.username = 'Username is required';
            }
            if (!ownProps.user_id && !state.password.trim()) {
                errors.password = errors.confirm_password = 'Password is required';
            }
            if (state.password.trim() != state.confirm_password.trim()) {
                errors.password = errors.confirm_password = 'Passwords should be equal';
            }
            if (!state.role.trim()) {
                errors.role = 'Role is required';
            }
            if (_.toArray(errors).length) {
                dispatch(actions.showUserErrors(errors));
            } else {
                dispatch(actions.showUserErrors(errors));
                var user = {
                    email: state.email,
                    password: state.password,
                    confirm_password: state.confirm_password,
                    username: state.username,
                    role: state.role,
                    relayboards: state.relayboards,
                    _id: ownProps.user_id
                };
                Meteor.call('saveUser', user, function (err, result) {
                    if (err) {
                        dispatch(actions.showUserErrors({general: err}));
                    } else if (result.status == 'error') {
                        dispatch(actions.showUserErrors({general: result.message}));
                    } else {
                        location.href = '/users';
                    }
                });
            }
        },
        onRelayBoardCheck: (id) => {
            var state = Store.store.getState().Users.user.item;
            var relayboards = state.relayboards;
            if (relayboards.indexOf(id)==-1) {
                relayboards.push(id);
            } else {
                relayboards.splice(relayboards.indexOf(id),1);
            }
            dispatch(actions.changeFieldValue('relayboards',relayboards));
        }
    };
};

var UserContainer = withTracker((props) => {
        if (!Store.store.getState().Users.user.item || !Store.store.getState().Users.user.item.role) {
            if (!props.user_id) {
                Store.store.dispatch(actions.updateUser({
                    role: 'user',
                    relayboards: [],
                    username: '',
                    emails: [{
                        address: '',
                        verified: false
                    }],
                    password: '',
                    confirm_password: ''
                }));
            } else {
                var user = Meteor.users.findOne({_id: props.user_id}, {relayboards: 1, role: 1});
                Store.store.dispatch(actions.updateUser(user));
            }
        }
    return {
    };
})(connect(mapStateToProps,mapDispatchToProps)(User));

export default UserContainer;


