import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import {Accounts} from 'meteor/accounts-base';
import actions from '../actions/ResetPasswordLinkFormActions';
import ResetPasswordLinkForm from '../components/ResetPasswordLinkForm';
import Store from '../store/Store';

const mapStateToProps = (state) => {
    return {
        email: state.ResetPasswordLinkForm.email,
        errors: state.ResetPasswordLinkForm.errors,
        email_sent: state.ResetPasswordLinkForm.email_sent
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeEmailField: function(e) {
            dispatch(actions.changeEmailField(e.target.value));
        },
        onFormSubmit: function(e) {
            e.preventDefault();
            var state = Store.store.getState().ResetPasswordLinkForm;
                errors = {};
            if (!state.email.trim().length) {
                errors.email = 'Email address is required';
            }
            if (_.toArray(errors).length) {
                dispatch(actions.setErrorMessages(errors));
            } else {
                Accounts.forgotPassword({email:state.email}, function(err) {
                    if (err) {
                        errors.general = err.message;
                        dispatch(actions.setErrorMessages(errors));
                    } else {
                        dispatch(actions.setEmailSent());
                    }
                });
            }
        }
    };
};

var ResetPasswordLinkFormContainer = connect(mapStateToProps,mapDispatchToProps)(ResetPasswordLinkForm);

export default ResetPasswordLinkFormContainer;