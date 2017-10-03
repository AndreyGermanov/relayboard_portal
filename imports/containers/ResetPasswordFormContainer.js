import _ from 'lodash';
import {connect} from 'react-redux';
import {Accounts} from 'meteor/accounts-base';
import actions from '../actions/ResetPasswordFormActions';
import ResetPasswordForm from '../components/ResetPasswordForm';
import Store from '../store/Store';

const mapStateToProps = (state) => {
    return {
        password: state.ResetPasswordForm.password,
        confirm_password: state.ResetPasswordForm.confirm_password,
        errors: state.ResetPasswordLinkForm.errors,
        confirmed: state.ResetPasswordLinkForm.confirmed
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        onChangePasswordField: function(e) {
            dispatch(actions.changePasswordField(e.target.value));
        },
        onChangeConfirmPasswordField: function(e) {
            dispatch(actions.changeConfirmPasswordField(e.target.value));
        },
        onFormSubmit: function(e) {
            e.preventDefault();
            var state = Store.store.getState().ResetPasswordForm;
                errors = {};
            if (!state.password.trim().length) {
                errors.password = 'Password is required';
            }
            if (!state.confirm_password.trim().length) {
                errors.confirm_password = 'Password is required';
            }
            if (state.confirm_password.trim() != state.password.trim()) {
                errors.general = 'Passwords must match';
            }
            if (_.toArray(errors).length) {
                dispatch(actions.setErrorMessages(errors));
            } else {
                Accounts.resetPassword(ownProps.match.params.token, state.password, function(err) {
                    if (err) {
                        errors.general = err.message;
                        dispatch(actions.setErrorMessages(errors));
                    } else {
                        location.href = '/';
                    }
                });
            }
        }
    };
};

var ResetPasswordFormContainer = connect(mapStateToProps,mapDispatchToProps)(ResetPasswordForm);

export default ResetPasswordFormContainer;