import Entity from './Entity';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

var Users = class extends Entity {
    constructor() {
        super();
        this.ddpMethods = [
            'saveUser',
            'deleteUser'
        ];
    }

    saveUser(params) {
        if (!Meteor.userId() || Meteor.user().role != 'admin') {
            return {status: 'error', message: 'Authentication error'};
        }
        if (!params.email) {
            return {status: 'error', message: 'Email is required'};
        }
        if (!params.username) {
            return {status: 'error', message: 'User name is required'};
        }
        if (!params.role) {
            return {status: 'error', message: 'Role is required'};
        }
        if (params.password != params.confirm_password) {
            return {status: 'error', message: 'Passwords does not match'};
        }
        var same_users_by_name = Meteor.users.find({username: params.username}).fetch(),
            same_users_by_email = Meteor.users.find({emails: {$elemMatch: {address: params.email}}}).fetch();
        if (params._id) {
            if (same_users_by_name.length > 1) {
                return {status: 'error', message: 'User with specified name already exists'};
            }
            if (same_users_by_email.length > 1) {
                return {status: 'error', message: 'User with specified email already exists'};
            }

            if (params.password) {
                Accounts.setPassword(params._id, params.password);
            }

            Meteor.users.update({_id: params._id}, {
                $set: {
                    username: params.username,
                    role: params.role,
                    relayboards: params.relayboards,
                    emails: [
                        {
                            address: params.email,
                            verified: false
                        }
                    ]
                }
            });
        } else {
            if (same_users_by_name && same_users_by_name.length) {
                return {status: 'error', message: 'User with specified name already exists'};
            }
            if (same_users_by_email && same_users_by_email.length) {
                return {status: 'error', message: 'User with specified email already exists'};
            }
            if (!params.password) {
                return {status: 'error', message: 'Password is required'};
            }
            var user_id = Accounts.createUser({
                username: params.username,
                email: params.email,
                password: params.password
            });
            Meteor.users.update({_id: user_id}, {
                $set: {
                    role: params.role,
                    relayboards: params.relayboards
                }
            });
        }
        return {status: 'ok'};
    }

    deleteUser(params) {
        if (!Meteor.userId() || Meteor.user().role != 'admin') {
            return {status: 'error', message: 'Authentication error'};
        }
        if (!params || !params.id) {
            return {status: 'error', message: 'User not specified'};
        }
        console.log(Meteor.users.remove({_id:params.id}));
        return {status: 'ok'};
    }

};

export default Users;