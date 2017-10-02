import React,{Component} from 'react';
import moment from 'moment';
import _ from 'lodash';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const RelayChart = class extends Component {
    shouldComponentUpdate(nextProps,nextState) {
        for (var i in this.props) {
            if (!_.isEqual(this.props[i],nextProps[i]) && typeof(this.props[i])!='function') {
                return true;
            }
        }
        return false;
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

        var chart = <ResponsiveContainer width="95%" height={300}>
            <LineChart width={730} height={250} data={data}
                       margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="time" stroke="black"/>
                <YAxis stroke="black"/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#aaaa00" dot={false} strokeWidth={2}/>
                <Line type="monotone" dataKey="humidity" stroke="#00aaaa" dot={false} strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>;

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
                                    <select className="form-control" style={{color:'black'}} value={this.props.period} onChange={this.props.onPeriodChange.bind(this)}>
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
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
        } else {
            return <div>{this.props.config.type}</div>
        }
    }
};

export default RelayChart;