import _ from 'lodash';
import actions from '../actions/DashboardActions';
import moment from 'moment-timezone';

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
            if (newState.relayboards[action.relayboard_id].current_relay != action.number) {
                newState.relayboards[action.relayboard_id].current_relay = action.number;
                if (!newState.relayboards[action.relayboard_id].relayChartSettings) {
                    newState.relayboards[action.relayboard_id].relayChartSettings = {};
                }
                newState.relayboards[action.relayboard_id].relayChartSettings[action.number] = {
                    dateStart: moment().startOf('day'),
                    dateEnd: moment(),
                    series: []
                };
                var config = _.find(newState.relayboards[action.relayboard_id].config.pins,{number:action.number});
                if (config && typeof(config) != 'undefined') {
                    if (config.type == 'temperature') {
                        newState.relayboards[action.relayboard_id].relayChartSettings[action.number].series = [
                            'temperature'
                        ];
                    } else if (config.type == 'relay') {
                        newState.relayboards[action.relayboard_id].relayChartSettings[action.number].series = [
                            'status'
                        ];
                    }
                }
            }
            break;
        case actions.types.SET_RELAY_CHART_PERIOD:
            newState.relayboards[action.relayboard_id].relayChartSettings[action.number].period = action.period;
            switch (action.period) {
                case 'day':
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateStart = moment().startOf('day');
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateEnd = moment();
                    break;
                case 'week':
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateStart = moment().startOf('week');
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateEnd = moment();
                    break;
                case 'month':
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateStart = moment().startOf('month');
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateEnd = moment();
                    break;
                case 'year':
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateStart = moment().startOf('year');
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateEnd = moment();
                    break;
                default:
            }
            break;
        case actions.types.SET_RELAYBOARDS:
            for (var i in action.relayboards) {
                var relayboard = _.cloneDeep(action.relayboards[i]);
                if (newState.relayboards[relayboard._id]) {
                    relayboard.relayChartSettings = _.cloneDeep(newState.relayboards[relayboard._id].relayChartSettings);
                    relayboard.current_relay = newState.relayboards[relayboard._id].current_relay;
                    relayboard.sensor_data = newState.relayboards[relayboard._id].sensor_data;
                } else {
                    relayboard.relayChartSettings = {};
                    relayboard.sensor_data = {};
                    relayboard.current_relay = null;
                }
                newState.relayboards[relayboard._id] = relayboard;
            }
            break;
        case actions.types.TOGGLE_RELAYCHART_SERIE:
            var settings = newState.relayboards[action.relayboard_id].relayChartSettings[action.number];
            if (settings.series.indexOf(action.serie) == -1) {
                settings.series.push(action.serie);
            } else {
                settings.series.splice(settings.series.indexOf(action.serie),1);
            }
            newState.relayboards[action.relayboard_id].relayChartSettings[action.number] = _.cloneDeep(settings);
            break;
        case actions.types.UPDATE_SENSOR_DATA:
            if (newState.relayboards[action.relayboard_id]) {
                if (!newState.relayboards[action.relayboard_id].sensor_data) {
                    newState.relayboards[action.relayboard_id].sensor_data = {};
                }
                if (!_.isEqual(newState.relayboards[action.relayboard_id].sensor_data[action.number],action.sensor_data)) {
                    newState.relayboards[action.relayboard_id].sensor_data[action.number] = JSON.parse(action.sensor_data);
                }
            }
            break;
        default:
    }
    return newState;
};

export default DashboardReducer;