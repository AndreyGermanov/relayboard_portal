import React,{Component} from 'react';
import Entity from './Entity';
import moment from 'moment';
import _ from 'lodash';
import RelayChartWrapper from './RelayChartWrapper';
var DateTime = require('react-datetime');

const RelayChart = class extends Entity {

    componentDidUpdate() {

    }

    renderRelayChart() {
        var data = [];
        if (this.props.sensor_data && this.props.sensor_data.length) {
            var firstRecord = this.props.sensor_data[0],
                timeFrom = firstRecord.timestamp,
                prev_rounded_timestamp = Math.round(timeFrom/60000)*60000,
                previous_status = 0,
                status = 0;

            for (var i in this.props.sensor_data) {
                if (this.props.sensor_data[i].status === null) {
                    continue;
                }
                data.push({
                    time: moment(this.props.sensor_data[i].timestamp).format('DD-MM-YYYY HH:mm:ss'),
                    status: this.props.sensor_data[i].status
                });
            }
        }

        var series = this.props.series.map((serie) => {
            var result = {
                name: serie
            };
            if (serie == 'status') {
                result.color = '#aaaa00';
            }
            return result;
        });

        var period = null;

        if (this.props.period == 'custom') {

            period =
                <div>
                    <div className="col-sm-3">
                        <DateTime value={this.props.dateStart} onChange={this.props.onDateStartChange.bind(this)}/>
                    </div>
                    <div className="col-sm-3">
                        <DateTime value={this.props.dateEnd} onChange={this.props.onDateEndChange.bind(this)}/>
                    </div>
                </div>;
        }

        /*jshint ignore:start */
        var chart = <RelayChartWrapper data={data} series={series}/>;
        /*jshint ignore:end */

        return (
            /*jshint ignore:start */
            <div style={{padding:"20px"}}>
                <div className="panel panel-blur panel-relaychart">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.config.title} ({moment(this.props.dateStart).format('YYYY-MM-DD HH:mm:ss')}-{moment(this.props.dateEnd).format('YYYY-MM-DD HH:mm:ss')})
                            <span className="pull-right">
                                <button onClick={this.props.onUpdateClick.bind(this)} className="btn btn-default btn-xs">
                                    <span className="fa fa-refresh"/>&nbsp;Update
                                </button>&nbsp;&nbsp;&nbsp;
                                <button onClick={this.props.onCloseClick.bind(this)} className="btn btn-danger btn-xs">
                                    <span className="fa fa-remove"/>&nbsp;Close
                                </button>
                            </span>
                        </h3>
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="periodInput" className="col-sm-1">Period</label>
                                <div className="col-sm-3">
                                    <select className="form-control" value={this.props.period}
                                            onChange={this.props.onPeriodChange.bind(this)}>
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                {period}
                            </div>
                        </form>
                        {chart}
                    </div>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }

    renderTemperatureChart() {
        var data = [];
        if (this.props.sensor_data && this.props.sensor_data.length) {
            var firstRecord = this.props.sensor_data[0],
                timeFrom = firstRecord.timestamp,
                prev_rounded_timestamp = Math.round(timeFrom/60000)*60000,
                previous_temperature = 0,
                previous_humidity = 0,
                number_of_minutes = 0,
                minute = 0,
                temperature = 0,
                humidity = 0;

            for (var i in this.props.sensor_data) {
                if (this.props.sensor_data[i].temperature && !previous_temperature) {
                    previous_temperature = this.props.sensor_data[i].temperature;
                }
                if (this.props.sensor_data[i].humidity && !previous_humidity) {
                    previous_humidity = this.props.sensor_data[i].humidity;
                }
            }

            for (i in this.props.sensor_data) {
                if (!this.props.sensor_data[i].temperature) {
                    continue;
                }
                var rounded_timestamp = Math.round(this.props.sensor_data[i].timestamp / 60000) * 60000;
                number_of_minutes = (rounded_timestamp - prev_rounded_timestamp) / 60000;
                for (minute = 0; minute < number_of_minutes; minute++) {
                    temperature = this.props.sensor_data[i].temperature;
                    humidity = this.props.sensor_data[i].humidity;
                    if (!temperature) {
                        temperature = previous_temperature;
                    } else {
                        previous_temperature = temperature;
                    }
                    if (!humidity) {
                        humidity = previous_humidity;
                    } else {
                        previous_humidity = humidity;
                    }
                    data.push({
                        time: moment(rounded_timestamp + minute * 60000).format('DD-MM-YYYY HH:mm:ss'),
                        temperature: temperature,
                        humidity: humidity
                    });
                }
                prev_rounded_timestamp = rounded_timestamp;
            }

            var current_timestamp = Math.round(moment().unix() * 1000 / 60000) * 60000;
            number_of_minutes = (current_timestamp - prev_rounded_timestamp) / 60000;
            for (minute = 0; minute <= number_of_minutes; minute++) {
                temperature = previous_temperature;
                humidity = previous_humidity;
                data.push({
                    time: moment(prev_rounded_timestamp + minute * 60000).format('DD-MM-YYYY HH:mm:ss'),
                    temperature: temperature,
                    humidity: humidity
                });
            }
        }

        var series = this.props.series.map((serie) => {
            var result = {
                name: serie
            };
            if (serie == 'temperature') {
                result.color = '#aaaa00';
            } else if (serie == 'humidity') {
                result.color = '#00aaaa';
            }
            return result;
        });

        var period = null;

        if (this.props.period == 'custom') {

            period =
                <div>
                    <div className="col-sm-3">
                    <DateTime value={this.props.dateStart} onChange={this.props.onDateStartChange.bind(this)}/>
                    </div>
                    <div className="col-sm-3">
                    <DateTime value={this.props.dateEnd} onChange={this.props.onDateEndChange.bind(this)}/>
                    </div>
                </div>;
        }

        /*jshint ignore:start */
        var chart = <RelayChartWrapper data={data} series={series}/>;
        /*jshint ignore:end */

        return (
            /*jshint ignore:start */
            <div style={{padding:"20px"}}>
                <div className="panel panel-blur panel-relaychart">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.config.title} ({moment(this.props.dateStart).format('YYYY-MM-DD HH:mm:ss')}-{moment(this.props.dateEnd).format('YYYY-MM-DD HH:mm:ss')})
                            <span className="pull-right">
                                <button onClick={this.props.onUpdateClick.bind(this)} className="btn btn-default btn-xs">
                                    <span className="fa fa-refresh"/>&nbsp;Update
                                </button>&nbsp;&nbsp;&nbsp;
                                <button onClick={this.props.onCloseClick.bind(this)} className="btn btn-danger btn-xs">
                                    <span className="fa fa-remove"/>&nbsp;Close
                                </button>
                            </span>
                        </h3>
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="periodInput" className="col-sm-1">Period</label>
                                <div className="col-sm-3">
                                    <select className="form-control" value={this.props.period}
                                            onChange={this.props.onPeriodChange.bind(this)}>
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                {period}
                            </div>
                        </form>
                        {chart}
                        <div style={{textAlign:'center'}}>
                            <input type="checkbox"
                                   onChange={this.props.onCheckSerie.bind(this,'temperature')}
                                   checked={this.props.series.indexOf('temperature')!=-1}/>
                            <span style={{color:'#aaaa00'}}>Temperature</span> &nbsp;&nbsp;
                            <input type="checkbox"
                                   onChange={this.props.onCheckSerie.bind(this,'humidity')}
                                   checked={this.props.series.indexOf('humidity')!=-1}/>
                            <span style={{color:'#00aaaa'}}>Humidity</span>
                        </div>
                    </div>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }

    render() {
        if (this.props.config.type == 'temperature') {
            return this.renderTemperatureChart();
        } else if (this.props.config.type == 'relay') {
            return this.renderRelayChart();
        } else {
            /*jshint ignore:start */
            return <div>{this.props.config.type}</div>
            /*jshint ignore:end */
        }
    }
};

export default RelayChart;