import {Meteor} from 'meteor/meteor';
import Store from '../store/Store';
import moment from 'moment-timezone';
import _ from 'lodash';

var DashboardActions = class {

    constructor() {
        this.types = {
            SET_CURRENT_RELAYBOARD_CHART: 'SET_CURRENT_RELAYBOARD_CHART',
            SET_RELAY_CHART_PERIOD: 'SET_RELAY_CHART_PERIOD',
            SET_RELAYBOARDS: 'SET_RELAYBOARDS',
            TOGGLE_RELAYCHART_SERIE: 'TOGGLE_RELAYCHART_SERIE',
            UPDATE_SENSOR_DATA: 'UPDATE_SENSOR_DATA',
            SET_RELAY_CHART_DATE_START: 'SET_RELAY_CHART_DATE_START',
            SET_RELAY_CHART_DATE_END: 'SET_RELAY_CHART_DATE_END',
            SET_TERMINAL_COMMAND: 'SET_TERMINAL_COMMAND',
            ADD_LINES_TO_TERMINAL_BUFFER: 'ADD_LINES_TO_TERMINAL_BUFFER',
            CLEAR_TERMINAL_BUFFER: 'CLEAR_TERMINAL_BUFFER',
            RELAY_MOUSE_DOWN: 'RELAY_MOUSE_DOWN',
            RELAY_MOUSE_UP: 'RELAY_MOUSE_UP',
            DASHBOARD_MOUSE_UP: 'DASHBOARD_MOUSE_UP'
        };
    }

    setCurrentRelayboardChart(relayboard_id,number) {
        return {
            type: this.types.SET_CURRENT_RELAYBOARD_CHART,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    setRelayChartPeriod(relayboard_id,number,period) {
        return {
            type: this.types.SET_RELAY_CHART_PERIOD,
            period: period,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    setRelayChartDateStart(relayboard_id,number,dateStart) {
        return {
            type: this.types.SET_RELAY_CHART_DATE_START,
            dateStart: dateStart,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    setRelayChartDateEnd(relayboard_id,number,dateEnd) {
        return {
            type: this.types.SET_RELAY_CHART_DATE_END,
            dateEnd: dateEnd,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    setRelayBoards(relayboards) {
        return {
            type: this.types.SET_RELAYBOARDS,
            relayboards: relayboards
        };
    }

    toggleRelayChartSerie(relayboard_id,number,serie) {
        return {
            type: this.types.TOGGLE_RELAYCHART_SERIE,
            relayboard_id: relayboard_id,
            number: number,
            serie: serie
        };
    }

    loadRelayChartData(props) {
        var self = this;
        return (dispatch) => {
            Meteor.call('getSensorData',
                {
                    relayboard_id:props.relayboard_id,
                    number:props.config.number,
                    series:props.settings.series,
                    dateStart:props.settings.dateStart.unix()*1000,
                    dateEnd:props.settings.dateEnd.unix()*1000
                }, function(err,records) {
                    if (!err && records) {
                        var result = [];
                        for (var i in records) {
                            var start_timestamp = records[i].data[0].timestamp;
                            var end_timestamp = records[i].data[records[i].data.length-1].timestamp;
                            var previous_item = 0;
                            for (var current_timestamp=start_timestamp;current_timestamp<=end_timestamp;current_timestamp+=records[i].level*1000) {
                                var item = _.find(records[i].data,{timestamp:current_timestamp});
                                if (item) {
                                    result.push(_.cloneDeep(item));
                                    previous_item = _.cloneDeep(item);
                                } else {
                                    previous_item.timestamp = current_timestamp;
                                    result.push(_.cloneDeep(previous_item));
                                }
                            }
                        }
                        dispatch(self.updateSensorData(props.relayboard_id,props.number,result));
                    } else {
                        console.log(err);
                    }
                }
            );
        };
    }

    updateSensorData(relayboard_id,number,sensor_data) {
        return {
            type: this.types.UPDATE_SENSOR_DATA,
            number: number,
            relayboard_id: relayboard_id,
            sensor_data: sensor_data
        };
    }

    setTerminalCommand(relayboard_id,command) {
        return {
            type: this.types.SET_TERMINAL_COMMAND,
            relayboard_id: relayboard_id,
            command: command
        };
    }

    addLinesToTerminalBuffer(relayboard_id,lines) {
        return {
            type: this.types.ADD_LINES_TO_TERMINAL_BUFFER,
            relayboard_id: relayboard_id,
            lines: lines
        };
    }

    clearTerminalBuffer(relayboard_id) {
        return {
            type: this.types.CLEAR_TERMINAL_BUFFER,
            relayboard_id: relayboard_id
        };
    }

    sendTerminalCommand(relayboard_id) {
        var self = this;
        return (dispatch) => {
            var state = Store.store.getState().Dashboard.relayboards[relayboard_id];
            dispatch(self.addLinesToTerminalBuffer(relayboard_id,['$ '+state.terminal_command]));
            Meteor.call('execCommand', {id:relayboard_id,command:state.terminal_command}, function(err,result) {
                dispatch(self.setTerminalCommand(relayboard_id,''));
            });
        };
    }

    relayMouseDown(relayboard_id,number) {
        return {
            type: this.types.RELAY_MOUSE_DOWN,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    relayMouseUp(relayboard_id,number) {
        return {
            type: this.types.RELAY_MOUSE_UP,
            relayboard_id: relayboard_id,
            number: number
        };
    }

    dashboardMouseUp() {
        return {
            type: this.types.DASHBOARD_MOUSE_UP
        }
    }
};

export default new DashboardActions();