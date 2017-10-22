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

    if (typeof actions.types == 'undefined') {
        return newState;
    }

    switch (action.type) {
        case  actions.types.SET_CURRENT_RELAYBOARD_CHART:
            if (!newState.relayboards[action.relayboard_id] || typeof newState.relayboards[action.relayboard_id] == 'undefined') {
                newState.relayboards[action.relayboard_id] = {
                };
            }
            if (newState.relayboards[action.relayboard_id].current_relay != action.number) {
                newState.relayboards[action.relayboard_id].current_relay = action.number;
                if (!newState.relayboards[action.relayboard_id].relayChartSettings) {
                    newState.relayboards[action.relayboard_id].relayChartSettings = {};
                }
                if (!newState.relayboards[action.relayboard_id].relayChartSettings[action.number]) {
                    newState.relayboards[action.relayboard_id].relayChartSettings[action.number] = {
                        dateStart: moment().startOf('day'),
                        dateEnd: moment(),
                        period: 'live',
                        series: []
                    };
                    var config = _.find(newState.relayboards[action.relayboard_id].config.pins, {number: action.number});
                    if (config && typeof(config) != 'undefined') {
                        if (!newState.relayboards[action.relayboard_id].relayChartSettings[action.number].series.length) {
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
        case actions.types.SET_RELAY_CHART_DATE_START:
            newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateStart = action.dateStart;
            break;
        case actions.types.SET_RELAY_CHART_DATE_END:
            newState.relayboards[action.relayboard_id].relayChartSettings[action.number].dateEnd = action.dateEnd;
            break;
        case actions.types.SET_RELAYBOARDS:
            for (var i in action.relayboards) {
                var relayboard = _.cloneDeep(action.relayboards[i]);
                if (newState.relayboards[relayboard._id]) {
                    if (!newState.relayboards[relayboard._id].live_sensor_data) {
                        newState.relayboards[relayboard._id].live_sensor_data = {};
                    }
                    relayboard.live_sensor_data = _.cloneDeep(newState.relayboards[relayboard._id].live_sensor_data);
                    relayboard.relayChartSettings = _.cloneDeep(newState.relayboards[relayboard._id].relayChartSettings);
                    relayboard.current_relay = newState.relayboards[relayboard._id].current_relay;
                    relayboard.sensor_data = newState.relayboards[relayboard._id].sensor_data;
                    if (relayboard.buffer && relayboard.buffer.length && !_.isEqual(relayboard.buffer,newState.relayboards[relayboard._id].prev_buffer)) {
                        relayboard.prev_buffer = _.cloneDeep(relayboard.buffer);
                        relayboard.buffer = relayboard.buffer.shift();
                        for (var index in relayboard.buffer) {
                            newState.relayboards[relayboard._id].terminal_buffer.push(relayboard.buffer[index]);
                        }
                    };
                    if (!newState.relayboards[relayboard._id].terminal_buffer || typeof(newState.relayboards[relayboard._id].terminal_buffer) == 'undefined') {
                        newState.relayboards[relayboard._id].terminal_buffer = [];
                    };
                    relayboard.terminal_buffer = newState.relayboards[relayboard._id].terminal_buffer;
                    relayboard.terminal_command = newState.relayboards[relayboard._id].terminal_command;
                    var status = relayboard.status;
                    for (var i1 in relayboard.config.pins) {
                        if (typeof(status[relayboard.config.pins[i1].number]) == 'undefined') {
                            continue;
                        }
                        if (!relayboard.live_sensor_data[relayboard.config.pins[i1].number]) {
                            relayboard.live_sensor_data[relayboard.config.pins[i1].number] = [];
                        }
                        var current_status = {
                            time: moment(relayboard.status_timestamp).format('DD-MM-YYYY HH:mm:ss')
                        };
                        if (relayboard.config.pins[i1].type == 'relay') {
                            current_status.status = parseInt(status[relayboard.config.pins[i1].number]);
                        } else if (relayboard.config.pins[i1].type == 'temperature') {
                            var status_parts = status[relayboard.config.pins[i1].number].toString().split('|');
                            current_status.temperature = parseFloat(status_parts.shift());
                            current_status.humidity = parseFloat(status_parts.pop());
                        }
                        if (relayboard.config.pins[i1].number == relayboard.current_relay) {
                            if (relayboard.live_sensor_data[relayboard.config.pins[i1].number] > 100) {
                                relayboard.live_sensor_data[relayboard.config.pins[i1].number].shift();
                            }
                            relayboard.live_sensor_data[relayboard.config.pins[i1].number].push(current_status);
                        } else {
                            relayboard.live_sensor_data[relayboard.config.pins[i1].number] = [];
                        }
                    }
                } else {
                    relayboard.relayChartSettings = {};
                    relayboard.live_sensor_data = [];
                    relayboard.terminal_command = '';
                    relayboard.terminal_buffer = [];
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
                    newState.relayboards[action.relayboard_id].sensor_data[action.number] = [];
                    for (var i in action.sensor_data) {
                        action.sensor_data[i].time = moment(action.sensor_data[i].timestamp).format('YYYY-MM-DD HH:mm:ss');
                        newState.relayboards[action.relayboard_id].sensor_data[action.number] = _.concat(newState.relayboards[action.relayboard_id].sensor_data[action.number],
                            action.sensor_data[i]);
                    }
                }
            }
            break;
        case actions.types.SET_TERMINAL_COMMAND:
            if (newState.relayboards[action.relayboard_id]) {
                newState.relayboards[action.relayboard_id].terminal_command = action.command;
            }
            break;
        case actions.types.ADD_LINES_TO_TERMINAL_BUFFER:
            if (newState.relayboards[action.relayboard_id] && action.lines && action.lines.length) {
                action.lines.forEach(function(line) {
                    if (line.toString().trim()) {
                        newState.relayboards[action.relayboard_id].terminal_buffer.push(line.toString().trim());
                    }
                })
            }
            break;
        case actions.types.CLEAR_TERMINAL_BUFFER:
            if (newState.relayboards[action.relayboard_id]) {
                newState.relayboards[action.relayboard_id].terminal_buffer = [];
            }
            break;
        default:
    }
    return newState;
};

export default DashboardReducer;