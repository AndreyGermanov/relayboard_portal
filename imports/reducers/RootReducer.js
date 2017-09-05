import _ from 'lodash';
import LoginFormReducer from './LoginFormReducer';

var RootReducer = (state,action) => {
    if (typeof(state) == 'undefined') {
        state = {
            LoginForm:{}
        }
    }
    var newState = _.cloneDeep(state);
    newState.LoginForm = LoginFormReducer(state.LoginForm,action);
    return newState;
}

export default RootReducer;