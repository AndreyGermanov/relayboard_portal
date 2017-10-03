import React,{Component} from 'react';
import Entity from './Entity';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import _ from 'lodash';

var RelayChartWrapper = class extends Entity {

    shouldComponentUpdate(nextProps,nextState) {
        for (var i in this.props) {
            if (i=='data') {
                if (!_.isEqual(this.props[i],nextProps[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    render() {
        var series = this.props.series.map((serie,index) => {
            /*jshint ignore:start */
            return <Line type="monotone" key={'serie_'+index} dataKey={serie.name} stroke={serie.color} dot={false} strokeWidth={2}/>
            /*jshint ignore:end */
        });
        return (
            /*jshint ignore:start */
            <ResponsiveContainer width="95%" height={300}>
                <LineChart width={730} height={250} data={this.props.data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="time" stroke="black"/>
                    <YAxis stroke="black"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip />
                    {series}
                </LineChart>
            </ResponsiveContainer>
            /*jshint ignore:end */
        );
    }
};

export default RelayChartWrapper;