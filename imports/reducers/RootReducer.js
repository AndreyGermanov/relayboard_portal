import _ from 'lodash';
import LoginFormReducer from './LoginFormReducer';
import ResetPasswordLinkFormReducer from './ResetPasswordLinkFormReducer';
import ResetPasswordFormReducer from './ResetPasswordFormReducer';
import DashboardReducer from './DashboardReducer';
import UsersReducer from './UsersReducer';
import AppActions from '../actions/AppActions';

var RootReducer = (state,action) => {
    if (typeof(state) == 'undefined' || !state) {
        state = {
            LoginForm:{},
            ResetPasswordLinkForm:{},
            ResetPasswordForm:{},
            Dashboard: {},
            Users: {},
            sideMenuVisible: false,
            userMenuVisible: false,
            router: null
        };
    }
    var newState = _.cloneDeep(state);
    newState.LoginForm = LoginFormReducer(state.LoginForm,action);
    newState.ResetPasswordLinkForm = ResetPasswordLinkFormReducer(state.ResetPasswordLinkForm,action);
    newState.ResetPasswordForm = ResetPasswordFormReducer(state.ResetPasswordForm,action);
    newState.Dashboard = DashboardReducer(state.Dashboard,action);
    newState.Users = UsersReducer(state.Users,action);

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
        case AppActions.types.MOUSE_UP:
            for (var relayboard_id in newState.Dashboard.relayboards) {
                for (var number in newState.Dashboard.relayboards[relayboard_id].relaySettings) {
                    if (!newState.Dashboard.relayboards[relayboard_id].relaySettings[number]) {
                        newState.Dashboard.relayboards[relayboard_id].relaySettings[number] = {
                            mousedown:false
                        }
                    } else {
                        newState.Dashboard.relayboards[relayboard_id].relaySettings[number].mousedown = false;
                    }
                }
            }
            break;
    }
    return newState;
};

export default RootReducer;