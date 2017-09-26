import _ from 'lodash';
import LoginFormReducer from './LoginFormReducer';
import ResetPasswordLinkFormReducer from './ResetPasswordLinkFormReducer';
import ResetPasswordFormReducer from './ResetPasswordFormReducer';
import DashboardReducer from './DashboardReducer';


var RootReducer = (state,action) => {
    if (typeof(state) == 'undefined' || !state) {
        state = {
            LoginForm:{},
            ResetPasswordLinkForm:{},
            ResetPasswordForm:{},
            Dashboard: {
                relayboards: {},
                errors: {}
            }
        }
    }
    var newState = _.cloneDeep(state);
    newState.LoginForm = LoginFormReducer(state.LoginForm,action);
    newState.ResetPasswordLinkForm = ResetPasswordLinkFormReducer(state.ResetPasswordLinkForm,action);
    newState.ResetPasswordForm = ResetPasswordFormReducer(state.ResetPasswordForm,action);
    newState.Dashboard = DashboardReducer(state.Dashboard,action);

    return newState;
}

export default RootReducer;