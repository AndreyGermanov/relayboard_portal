import _ from 'lodash';
import actions from '../actions/UsersActions';

var UsersReducer = (state,action) => {

    if (typeof(state)=='undefined' || !_.toArray(state).length) {
        state = {
            user: {
                item: {},
                errors: {}
            },
            errors: {}
        };
    }
    var newState = _.cloneDeep(state);
    switch (action.type) {
        case actions.types.UPDATE_USER:
            if (action.user) {
                if (!action.user.email) {
                    action.user.email = action.user.emails[0].address;
                    delete action.user.emails;
                }
                newState.user.item = {
                    email: action.user.email,
                    username: action.user.username,
                    role: action.user.role,
                    relayboards: action.user.relayboards,
                    password: '',
                    confirm_password: ''
                };
            } else {
                newState.user.item = null;
            }
            break;
        case actions.types.CHANGE_USER_FIELD_VALUE:
            if (typeof(newState.user.item[action.field]) != 'undefined') {
                newState.user.item[action.field] = action.value;
            }
            break;
        case actions.types.SHOW_USER_ERRORS:
            newState.user.errors = action.errors;
            break;
        case actions.types.SHOW_USERS_ERRORS:
            newState.errors = action.errors;
            break;
        default:
    }
    return newState;
};

export default UsersReducer;