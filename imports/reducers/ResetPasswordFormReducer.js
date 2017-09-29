import _ from 'lodash';
import actions from '../actions/ResetPasswordFormActions';

var ResetPasswordFormReducer = (state,action) => {

    if (typeof(state)=='undefined' || !_.toArray(state).length) {
        state = {
            password: '',
            confirm_password: '',
            errors: {}
        };
    }
    var newState = _.cloneDeep(state);
    switch (action.type) {
        case  actions.types.CHANGE_PASSWORD_FIELD:
            newState.password = action.value.toString().trim();
            break;
        case  actions.types.CHANGE_CONFIRM_PASSWORD_FIELD:
            newState.confirm_password = action.value.toString().trim();
            break;
        case actions.types.SET_ERROR_MESSAGES:
            newState.errors = {};
            for (var i in action.errors) {
                newState.errors[i] = action.errors[i];
            }
            break;
        default:
    }
    return newState;
};

export default ResetPasswordFormReducer;