import React,{Component} from 'react';
import moment from 'moment';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const RelayChart = class extends Component {
    render() {
        var data = [];
        var firstRecord = this.props.sensor_data[0],
            timeFrom = firstRecord.timestamp,
            prev_rounded_timestamp = Math.round(timeFrom/60000)*60000,
            previous_temperature = 0,
            previous_humidity = 0,
            number_of_minutes = 0,
            minute = 0,
            temperature = 0,
            humidity = 0;

        if (this.props.sensor_data) {
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
                var rounded_timestamp = Math.round(this.props.sensor_data[i].timestamp/60000)*60000;
                number_of_minutes = (rounded_timestamp-prev_rounded_timestamp)/60000;
                for (minute=0;minute<number_of_minutes;minute++) {
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
                        time: moment(rounded_timestamp+minute*60000).format('DD-MM-YYYY HH:mm:ss'),
                        temperature: temperature,
                        humidity: humidity
                    });
                }
                prev_rounded_timestamp = rounded_timestamp;
            }
        }
        var current_timestamp = Math.round(moment().unix()*1000/60000)*60000;
        number_of_minutes = (current_timestamp - prev_rounded_timestamp)/60000;
        for (minute=0;minute<=number_of_minutes;minute++) {
            temperature = previous_temperature;
            humidity = previous_humidity;
            data.push({
                time: moment(prev_rounded_timestamp+minute*60000).format('DD-MM-YYYY HH:mm:ss'),
                temperature: temperature,
                humidity: humidity
            });
        }

        return (
            /*jshint ignore:start */
            <div style={{padding:"20px"}}>
                <button onClick={() => this.forceUpdate()} className="btn btn-default btn-xs"><span className="fa fa-refresh"/>&nbsp;Update</button>
                <br/><br/>
                <div style={{backgroundColor:'white',padding:"30px"}}>
                    <ResponsiveContainer width="95%" height={300}>
                        <LineChart width={730} height={250} data={data}
                                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="time" stroke="black" />
                            <YAxis stroke="black"/>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend wrapperStyle={{ color:'black'}} />
                            <Line type="monotone" dataKey="temperature" stroke="#aaaa00" dot={false}  strokeWidth={2} />
                            <Line type="monotone" dataKey="humidity" stroke="#00aaaa" dot={false}  strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }
};

export default RelayChart;