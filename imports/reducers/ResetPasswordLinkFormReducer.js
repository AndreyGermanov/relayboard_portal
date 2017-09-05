import _ from 'lodash';
import actions from '../actions/ResetPasswordLinkFormActions';

var ResetPasswordLinkFormReducer = (state,action) => {

    if (typeof(state)=='undefined' || !_.toArray(state).length) {
        state = {
            email: '',
            email_sent: false,
            errors: {}
        }
    }
    var newState = _.cloneDeep(state);
    switch (action.type) {
        case  actions.types.CHANGE_EMAIL_FIELD:
            newState.email = action.value.toString().trim();
            break;
        case actions.types.SET_ERROR_MESSAGES:
            newState.errors = {};
            for (var i in action.errors) {
                newState.errors[i] = action.errors[i]
            }
            break;
        case actions.types.SET_EMAIL_SENT: {
            newState.email_sent = "YES";
            break;
        }
        default:
    }
    return newState;
}

export default ResetPasswordLinkFormReducer;