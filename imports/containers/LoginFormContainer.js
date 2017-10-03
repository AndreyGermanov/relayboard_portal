import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import actions from '../actions/LoginFormActions';
import LoginForm from '../components/LoginForm';
import Store from '../store/Store';

const mapStateToProps = (state) => {
    return {
        email: state.LoginForm.email,
        password: state.LoginForm.password,
        errors: state.LoginForm.errors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeEmailField: function(e) {
            dispatch(actions.changeEmailField(e.target.value));
        },
        onChangePasswordField: function(e) {
            dispatch(actions.changePasswordField(e.target.value));
        },
        onFormSubmit: function(e) {
            e.preventDefault();
            var state = Store.store.getState().LoginForm,
                errors = {};
            if (!state.email.trim().length) {
                errors.email = 'Email address is required';
            }
            if (!state.password.trim().length) {
                errors.password = 'Password is required';
            }
            if (_.toArray(errors).length) {
                dispatch(actions.setErrorMessages(errors));
            } else {
                Meteor.loginWithPassword(state.email,state.password,function(err) {
                    if (err) {
                        errors.general = err.message;
                        dispatch(actions.setErrorMessages(errors));
                    } else {
                        dispatch(actions.changeEmailField(''));
                        dispatch(actions.changePasswordField(''));
                    }
                });
            }
        }
    };
};

var LoginFormContainer = connect(mapStateToProps,mapDispatchToProps)(LoginForm);

export default LoginFormContainer;