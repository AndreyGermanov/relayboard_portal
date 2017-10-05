import React from 'react';
import {Meteor} from 'meteor/meteor';

var UsersActions = class {

    constructor() {
        this.types = {
            UPDATE_USER: 'UPDATE_USER',
            CHANGE_USER_FIELD_VALUE: 'CHANGE_USER_FIELD_VALUE',
            SHOW_USER_ERRORS: 'SHOW_USER_ERRORS',
            SHOW_USERS_ERRORS: 'SHOW_USERS_ERRORS'
        };
    }

    updateUser(user) {
        return {
            type: this.types.UPDATE_USER,
            user: user
        };
    }

    changeFieldValue(field,value) {
        return {
            type: this.types.CHANGE_USER_FIELD_VALUE,
            field: field,
            value: value
        };
    }

    showUserErrors(errors) {
        return {
            type: this.types.SHOW_USER_ERRORS,
            errors: errors
        };
    }

    showUsersErrors(errors) {
        return {
            type: this.types.SHOW_USERS_ERRORS,
            errors: errors
        };
    }

    deleteUser(id) {
        var self = this;
        return (dispatch) => {
            dispatch(self.showUsersErrors({}));
            Meteor.call('deleteUser', {id: id}, function (err, result) {
                if (err) {
                    dispatch(self.showUsersErrors({'general':err}));
                } else if (result.status == 'error') {
                    dispatch(self.showUsersErrors({'general':result.message}));
                }
            });
        };
    }
};

export default new UsersActions();