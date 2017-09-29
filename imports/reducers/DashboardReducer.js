import _ from 'lodash';
import actions from '../actions/DashboardActions';

var DashboardReducer = (state,action) => {

    if (typeof(state)=='undefined' || !_.toArray(state).length) {
        state = {
            relayboards: {},
            errors: {}
        };
    }
    var newState = _.cloneDeep(state);
    switch (action.type) {
        case  actions.types.SET_CURRENT_RELAYBOARD_CHART:
            if (!newState.relayboards[action.relayboard_id] || typeof newState.relayboards[action.relayboard_id] == 'undefined') {
                newState.relayboards[action.relayboard_id] = {};
            }
            newState.relayboards[action.relayboard_id].current_relay = action.index;
            break;
        default:
    }
    return newState;
};

export default DashboardReducer;