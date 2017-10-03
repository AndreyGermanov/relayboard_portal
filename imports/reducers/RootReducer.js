import _ from 'lodash';
import LoginFormReducer from './LoginFormReducer';
import ResetPasswordLinkFormReducer from './ResetPasswordLinkFormReducer';
import ResetPasswordFormReducer from './ResetPasswordFormReducer';
import DashboardReducer from './DashboardReducer';
import AppActions from '../actions/AppActions';


var RootReducer = (state,action) => {
    if (typeof(state) == 'undefined' || !state) {
        state = {
            LoginForm:{},
            ResetPasswordLinkForm:{},
            ResetPasswordForm:{},
            Dashboard: {
                relayboards: {},
                errors: {}
            },
            sideMenuVisible: false,
            userMenuVisible: false
        };
    }
    var newState = _.cloneDeep(state);
    newState.LoginForm = LoginFormReducer(state.LoginForm,action);
    newState.ResetPasswordLinkForm = ResetPasswordLinkFormReducer(state.ResetPasswordLinkForm,action);
    newState.ResetPasswordForm = ResetPasswordFormReducer(state.ResetPasswordForm,action);
    newState.Dashboard = DashboardReducer(state.Dashboard,action);

    switch (action.type) {
        case AppActions.types.TOGGLE_SIDE_MENU:
            newState.sideMenuVisible = !state.sideMenuVisible;
            break;
        case AppActions.types.TOGGLE_USER_MENU:
            if (typeof(action.value) == 'undefined') {
                newState.userMenuVisible = !state.userMenuVisible;
            } else {
                newState.userMenuVisible = action.value;
            }
            break;
    }
    return newState;
};

export default RootReducer;