import {Meteor} from 'meteor/meteor';

var DashboardActions = class {

    constructor() {
        this.types = {
            SET_CURRENT_RELAYBOARD_CHART: 'SET_CURRENT_RELAYBOARD_CHART',
            SET_RELAY_CHART_PERIOD: 'SET_RELAY_CHART_PERIOD',
            SET_RELAYBOARDS: 'SET_RELAYBOARDS',
            TOGGLE_RELAYCHART_SERIE: 'TOGGLE_RELAYCHART_SERIE',
            UPDATE_SENSOR_DATA: 'UPDATE_SENSOR_DATA'
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
        }
    }

    setRelayBoards(relayboards) {
        return {
            type: this.types.SET_RELAYBOARDS,
            relayboards: relayboards
        }
    }

    toggleRelayChartSerie(relayboard_id,number,serie) {
        return {
            type: this.types.TOGGLE_RELAYCHART_SERIE,
            relayboard_id: relayboard_id,
            number: number,
            serie: serie
        }
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
                }, function(err,result) {
                if (!err && result) {
                    dispatch(self.updateSensorData(props.relayboard_id,props.number,result));
                } else {
                    console.log(err);
                }
            })
        }
    }

    updateSensorData(relayboard_id,number,sensor_data) {
        return {
            type: this.types.UPDATE_SENSOR_DATA,
            number: number,
            relayboard_id: relayboard_id,
            sensor_data: sensor_data
        }
    }
};

export default new DashboardActions();